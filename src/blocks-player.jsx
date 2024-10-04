import paperCore from 'paper/dist/paper-core';
import { useRef, useEffect } from 'preact/hooks';
import { useEditor } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks-editor';

const supportedEvents = new Set([
  ScratchBlocks.Events.BLOCK_CHANGE,
  ScratchBlocks.Events.BLOCK_CREATE,
  ScratchBlocks.Events.BLOCK_DELETE,
  ScratchBlocks.Events.BLOCK_MOVE,
  ScratchBlocks.Events.COMMENT_CHANGE,
  ScratchBlocks.Events.COMMENT_CREATE,
  ScratchBlocks.Events.COMMENT_DELETE,
  ScratchBlocks.Events.COMMENT_MOVE,
  ScratchBlocks.Events.VAR_CREATE,
  ScratchBlocks.Events.VAR_DELETE,
  ScratchBlocks.Events.VAR_RENAME,
]);

export function BlocksPlayer({ width, height, generator, onSetup, ...props }) {
  const ref = useRef(null);
  const { fileList, selectedFileId, modifyFile } = useEditor();

  const file = fileList.find((file) => file.id === selectedFileId);
  ref.script = file.script;
  ref.xml = file.xml;

  if (ref.current) {
    const workspace = ScratchBlocks.getMainWorkspace();
    if (workspace && workspace !== ref.workspace) {
      ref.workspace = workspace;
      workspace.addChangeListener((e) => {
        if (workspace.isDragging()) return; // Don't update while changes are happening.
        if (!supportedEvents.has(e.type)) return;

        const xmlDom = ScratchBlocks.Xml.workspaceToDom(workspace);
        // exclude broadcast messages variables
        const xml = ScratchBlocks.Xml.domToText(xmlDom).replace(
          /<variable type="broadcast_msg"[^>]+>[^<]+<\/variable>/gi,
          '',
        );
        if (!ref.script || ref.xml !== xml) {
          const script = generator.workspaceToCode(workspace);
          if (ref.script !== script) modifyFile({ script });
        }
      });
    }
  }

  useEffect(() => {
    if (ref.current) {
      paperCore.setup(ref.current);
      if (onSetup) onSetup(ref.current);
    }
    return () => {
      paperCore.project.clear();
      paperCore.project.remove();
    };
  }, [ref]);

  return (
    <canvas
      id="blockcode-blocks-player"
      ref={ref}
      style={{ width, height }}
      {...props}
    />
  );
}
