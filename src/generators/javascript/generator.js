import { ScratchBlocks } from '@blockcode/blocks-editor';

export const javascriptGenerator = new ScratchBlocks.Generator('JavaScript');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
javascriptGenerator.addReservedWords(
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords
  'break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,new,return,super,switch,this,throw,try,typeof,var,void,while,with,yield,' +
    'enum,' +
    'implements,interface,let,package,private,protected,public,static,' +
    'await,' +
    'null,true,false,' +
    // Magic variable.
    'arguments,' +
    // Everything in the current environment (835 items in Chrome, 104 in Node).
    Object.getOwnPropertyNames(globalThis).join(','),
);

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence
 */
javascriptGenerator.ORDER_ATOMIC = 0; // 0 "" ...
javascriptGenerator.ORDER_NEW = 1.1; // new
javascriptGenerator.ORDER_MEMBER = 1.2; // . []
javascriptGenerator.ORDER_FUNCTION_CALL = 2; // ()
javascriptGenerator.ORDER_INCREMENT = 3; // ++
javascriptGenerator.ORDER_DECREMENT = 3; // --
javascriptGenerator.ORDER_BITWISE_NOT = 4.1; // ~
javascriptGenerator.ORDER_UNARY_PLUS = 4.2; // +
javascriptGenerator.ORDER_UNARY_NEGATION = 4.3; // -
javascriptGenerator.ORDER_LOGICAL_NOT = 4.4; // !
javascriptGenerator.ORDER_TYPEOF = 4.5; // typeof
javascriptGenerator.ORDER_VOID = 4.6; // void
javascriptGenerator.ORDER_DELETE = 4.7; // delete
javascriptGenerator.ORDER_DIVISION = 5.1; // /
javascriptGenerator.ORDER_MULTIPLICATION = 5.2; // *
javascriptGenerator.ORDER_MODULUS = 5.3; // %
javascriptGenerator.ORDER_SUBTRACTION = 6.1; // -
javascriptGenerator.ORDER_ADDITION = 6.2; // +
javascriptGenerator.ORDER_BITWISE_SHIFT = 7; // << >> >>>
javascriptGenerator.ORDER_RELATIONAL = 8; // < <= > >=
javascriptGenerator.ORDER_IN = 8; // in
javascriptGenerator.ORDER_INSTANCEOF = 8; // instanceof
javascriptGenerator.ORDER_EQUALITY = 9; // == != === !==
javascriptGenerator.ORDER_BITWISE_AND = 10; // &
javascriptGenerator.ORDER_BITWISE_XOR = 11; // ^
javascriptGenerator.ORDER_BITWISE_OR = 12; // |
javascriptGenerator.ORDER_LOGICAL_AND = 13; // &&
javascriptGenerator.ORDER_LOGICAL_OR = 14; // ||
javascriptGenerator.ORDER_CONDITIONAL = 15; // ?:
javascriptGenerator.ORDER_ASSIGNMENT = 16; // = += -= *= /= %= <<= >>= ...
javascriptGenerator.ORDER_COMMA = 17; // ,
javascriptGenerator.ORDER_NONE = 99; // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
javascriptGenerator.ORDER_OVERRIDES = [
  // (foo()).bar -> foo().bar
  // (foo())[0] -> foo()[0]
  [javascriptGenerator.ORDER_FUNCTION_CALL, javascriptGenerator.ORDER_MEMBER],
  // (foo())() -> foo()()
  [javascriptGenerator.ORDER_FUNCTION_CALL, javascriptGenerator.ORDER_FUNCTION_CALL],
  // (foo.bar).baz -> foo.bar.baz
  // (foo.bar)[0] -> foo.bar[0]
  // (foo[0]).bar -> foo[0].bar
  // (foo[0])[1] -> foo[0][1]
  [javascriptGenerator.ORDER_MEMBER, javascriptGenerator.ORDER_MEMBER],
  // (foo.bar)() -> foo.bar()
  // (foo[0])() -> foo[0]()
  [javascriptGenerator.ORDER_MEMBER, javascriptGenerator.ORDER_FUNCTION_CALL],

  // !(!foo) -> !!foo
  [javascriptGenerator.ORDER_LOGICAL_NOT, javascriptGenerator.ORDER_LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [javascriptGenerator.ORDER_MULTIPLICATION, javascriptGenerator.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [javascriptGenerator.ORDER_ADDITION, javascriptGenerator.ORDER_ADDITION],
  // a && (b && c) -> a && b && c
  [javascriptGenerator.ORDER_LOGICAL_AND, javascriptGenerator.ORDER_LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [javascriptGenerator.ORDER_LOGICAL_OR, javascriptGenerator.ORDER_LOGICAL_OR],
];

/**
 * Initialise the database of variable names.
 * @param {!ScratchBlocks.Workspace} workspace Workspace to generate code from.
 */
javascriptGenerator.init = function (workspace) {
  // Create a dictionary of definitions to be printed before the code.
  javascriptGenerator.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  javascriptGenerator.functionNames_ = Object.create(null);

  if (!javascriptGenerator.variableDB_) {
    javascriptGenerator.variableDB_ = new ScratchBlocks.Names(javascriptGenerator.RESERVED_WORDS_);
  } else {
    javascriptGenerator.variableDB_.reset();
  }

  javascriptGenerator.variableDB_.setVariableMap(workspace.getVariableMap());

  var defvars = [];
  // Add user variables.
  var variables = workspace.getAllVariables();
  for (var i = 0; i < variables.length; i++) {
    if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
      continue;
    }
    const varName = javascriptGenerator.variableDB_.getName(variables[i].getId(), ScratchBlocks.Variables.NAME_TYPE);
    if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
      defvars.push(`let ${varName}${ScratchBlocks.LIST_VARIABLE_TYPE} = [];`);
    } else {
      defvars.push(`let ${varName} = 0;`);
    }
  }

  // Add developer variables (not created or named by the user).
  var devVarList = ScratchBlocks.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    const varName = javascriptGenerator.variableDB_.getName(devVarList[i], ScratchBlocks.Names.DEVELOPER_VARIABLE_TYPE);
    if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
      defvars.push(`let ${varName}${ScratchBlocks.LIST_VARIABLE_TYPE} = [];`);
    } else {
      defvars.push(`let ${varName} = 0;`);
    }
  }

  // Declare all of the variables.
  if (defvars.length) {
    javascriptGenerator.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
javascriptGenerator.finish = function (code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in javascriptGenerator.definitions_) {
    definitions.push(javascriptGenerator.definitions_[name]);
  }
  // Clean up temporary data.
  delete javascriptGenerator.definitions_;
  delete javascriptGenerator.functionNames_;
  javascriptGenerator.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
javascriptGenerator.scrubNakedValue = function (line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @private
 */
javascriptGenerator.quote_ = function (string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\').replace(/\n/g, '\\\n').replace(/'/g, "\\'");
  return "'" + string + "'";
};

/**
 * Common tasks for generating JavaScript from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!ScratchBlocks.Block} block The current block.
 * @param {string} code The JavaScript code created for this block.
 * @return {string} JavaScript code with comments and subsequent blocks added.
 * @private
 */
javascriptGenerator.HAT_CODE = '/* HatCode */';
javascriptGenerator.scrub_ = function (block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection?.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = ScratchBlocks.utils.wrap(comment, javascriptGenerator.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode += '/**\n' + javascriptGenerator.prefixLines(comment + '\n', ' * ') + ' */\n';
      } else {
        commentCode += javascriptGenerator.prefixLines(comment + '\n', '// ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == ScratchBlocks.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = javascriptGenerator.allNestedComments(childBlock);
          if (comment) {
            commentCode += javascriptGenerator.prefixLines(comment, '// ');
          }
        }
      }
    }
  }

  if (block.startHat_) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = javascriptGenerator.blockToCode(nextBlock);
    if (nextCode) {
      nextCode = javascriptGenerator.prefixLines(nextCode, javascriptGenerator.INDENT);
      code = code.replace(javascriptGenerator.HAT_CODE, nextCode);
    }
    return commentCode + code;
  }

  if (block.parentBlock_) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = javascriptGenerator.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  }

  return '';
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!ScratchBlocks.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
javascriptGenerator.getAdjusted = function (block, atId, opt_delta, opt_negate, opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || javascriptGenerator.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = javascriptGenerator.valueToCode(block, atId, javascriptGenerator.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = javascriptGenerator.valueToCode(block, atId, javascriptGenerator.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = javascriptGenerator.valueToCode(block, atId, javascriptGenerator.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = javascriptGenerator.valueToCode(block, atId, order) || defaultAtIndex;
  }

  if (ScratchBlocks.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseFloat(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = javascriptGenerator.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = javascriptGenerator.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = javascriptGenerator.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
