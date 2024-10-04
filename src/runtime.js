import { EventEmitter } from 'node:events';
import paperCore from 'paper/dist/paper-core';

export class Runtime extends EventEmitter {
  static DEFAULT_FPS = 24;

  constructor(requestStop, fps = Runtime.DEFAULT_FPS) {
    super();
    this._fps = fps;
    this._frame_sec = 1 / fps;
    this._running = false;
    this._requestStop = requestStop;
    this._timer = 0;
    this._timers = [];
    this._data = {};
    this._greaterThen = {};
    this._eventsHappening = {};
  }

  launch(code) {
    if (DEVELOPMENT) {
      console.log(code);
    }

    try {
      const launcher = new Function('runtime', code);
      launcher(this);
    } catch (err) {
      this.stop();
      return err;
    }
  }

  get core() {
    return paperCore;
  }

  get data() {
    return this._data;
  }

  get running() {
    return this._running;
  }

  get time() {
    return (Date.now() - this._timer) / 1000;
  }

  resetTimer() {
    this._timer = Date.now();
  }

  when(eventName, listener) {
    this._eventsHappening[eventName] = this._eventsHappening[eventName] || [];
    this._eventsHappening[eventName].push(false);
    const i = this._eventsHappening[eventName].length - 1;
    this.on(`${eventName}_${i}`, listener);
  }

  whenGreaterThen(name, value, listener) {
    const key = `${name}>${value}`;
    this._greaterThen[key] = false;
    this.when(`greaterthen:${key}`, listener);
  }

  emit(...args) {
    return new Promise((resolve) => {
      if (this.running) {
        super.emit(...args, resolve);
      }
    });
  }

  fire(eventName, ...args) {
    this.emit(eventName, ...args);
    this._eventsHappening[eventName] = this._eventsHappening[eventName] || [];
    if (this._eventsHappening[eventName].length > 0) {
      return Promise.race(
        this._eventsHappening[eventName].map(async (happening, i) => {
          if (!happening) {
            this._eventsHappening[eventName][i] = true;
            await this.emit(`${eventName}_${i}`, ...args);
            this._eventsHappening[eventName][i] = false;
          }
        }),
      );
    }
    return Promise.resolve();
  }

  _handleFrameForGreaterThen(done) {
    const keys = Object.keys(this._greaterThen);
    for (const key of keys) {
      const [name, value] = key.split('>');
      if (name === 'TIMER') {
        const isGreater = this.time > parseFloat(value);
        if (isGreater && !this._greaterThen[key]) {
          this.fire(`greaterthen:${key}`);
        }
        this._greaterThen[key] = isGreater;
      }
    }
    done();
  }

  async _handleStart() {
    while (this.running) {
      if (!paperCore.project) {
        this.stop();
        break;
      }
      await this.nextFrame();
      this.fire('frame');
    }
  }

  start() {
    this._running = true;
    this.on('frame', this._handleFrameForGreaterThen.bind(this));
    this.on('start', this._handleStart.bind(this));
    this.fire('start');
    this.resetTimer();
  }

  async stop() {
    this.emit('stop');
    await this.nextFrame();
    this._running = false;
    await this.nextFrame();
    this._timers.forEach(clearTimeout);
    this._timers.length = 0;
    this._requestStop();
  }

  sleep(seconds) {
    return new Promise((resolve) => this._timers.push(setTimeout(resolve, seconds * 1000)));
  }

  nextFrame() {
    return this.sleep(this._frame_sec);
  }

  random(num1 = 1, num2 = 10) {
    const min = Math.ceil(Math.min(num1, num2));
    const max = Math.floor(Math.max(num1, num2));
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  number(value, defaultValue = 0) {
    return isNaN(value) ? defaultValue : +value;
  }

  index(value, length) {
    let index = this.number(value) - 1;
    index %= length;
    index += length;
    return index % length;
  }

  clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }
}
