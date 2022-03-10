// sockect
class SEventEmitter {
  constructor() {
    this._event = new Map();
    this._onceEvent = new Map();
  }
  _removeListener(mapName, eventName, callback) {
    let newArray = [];
    if (this[mapName].has(eventName)) {
      newArray = this[mapName].get(eventName).filter((value) => {
        return value !== callback;
      });
    }
    this[mapName].set(eventName, newArray);
  }
  /**
   * emit
   */
  /* eslint-disable */
  emit(eventName, ...args) {
    if (this._event.has(eventName)) {
      for (const fun of this._event.get(eventName)) {
        fun(...args);
      }
    }
    if (this._onceEvent.has(eventName)) {
      for (const fun of this._onceEvent.get(eventName)) {
        fun(...args);
        this._removeListener('_onceEvent', eventName, fun);
      }
    }
  }
  /**
   * on
   */
  on(eventName, callback) {
    if (this._event.has(eventName)) {
      this._event.get(eventName).push(callback);
    } else {
      this._event.set(eventName, [callback]);
    }
  }
  /**
   * once
   */
  once(eventName, callback) {
    if (this._onceEvent.has(eventName)) {
      this._onceEvent.get(eventName).push(callback);
    } else {
      this._onceEvent.set(eventName, [callback]);
    }
  }
  /**
   * removeListener
   */
  removeListener(eventName, callback) {
    this._removeListener('_event', eventName, callback);
    this._removeListener('_onceEvent', eventName, callback);
  }
  /**
   * removeAllListener
   */
  removeAllListener(eventName) {
    function batch(mapName) {
      if (this[mapName].has(eventName)) {
        this[mapName].delete(eventName);
      }
    }
    batch.call(this, '_event');
    batch.call(this, '_onceEvent');
  }
}

/**
 * 构造函数
 * @param url
 * @param userId
 * @param roomId
 */
export default class Socket extends SEventEmitter {
  /**
   * 创建一个客户端实例,如果指定了昵称则创建后就立即连接
   *
   * @param url 服务器地址
   * @param userId 服务器签名
   * @param roomId 房间
   */
  constructor(url) {
    super();
    this.times = 0;
    this.timer = null;
    this.url = url;
    this.state = {
      connect: false,
      tryError: false,
    };

    this.openListener = () => {
      this.state.connect = true;
      clearInterval(this.timer);
      this.timer = null;
      this.emit('start'); // 启动标识
    };
    this.closeListener = (event) => {
      this.terminate();
      this.emit('close', event);
    };
    this.errorListener = (event) => {
      this.terminate();
      this.emit('error', event);
    };
    this.messageListener = (event) => {
      const response = JSON.parse(event.data);
      this.emit(response.type, response);
    };

    this.connect(url);
  }
  /**
   * 调用后将对象转为JSON使用websocket.send方法发送
   * @param data 需要发送的数据
   */
  send(data) {
    if (this.webScoket && this.webScoket.readyState == this.webScoket.OPEN) {
      this.webScoket.send(JSON.stringify(data));
    }
  }

  /**
   * 调用后给内部的websocket添加监听
   */
  process() {
    if (this.state.connect) {
      throw '非法调用该方法只有在彻底断开连接的时候才可以调用!';
    }
    // 添加事件监听
    this.webScoket.addEventListener('open', this.openListener);
    this.webScoket.addEventListener('error', this.errorListener);
    this.webScoket.addEventListener('message', this.messageListener);
    this.webScoket.addEventListener('close', this.closeListener);
  }
  /**
   * 删除所有的监听器且不会发出错误信息,
   * 关闭socket连接且清空内部的引用
   */
  terminate() {
    this.state.tryError = true;
    // 删除所有的监听器
    this.webScoket.removeEventListener('close', this.closeListener);
    this.webScoket.removeEventListener('open', this.openListener);
    this.webScoket.removeEventListener('message', this.messageListener);
    this.webScoket.removeEventListener('error', this.errorListener);
    // 关闭连接
    this.webScoket.close();
    this.webScoket = null;
    this.state.connect = this.state.tryError = false;
  }
  /**
   * 调用后连接服务器,如果已经存在连接则彻底断开连接后再次连接
   */
  connect(url) {
    const openCode = WebSocket.OPEN;
    const connectCode = WebSocket.CONNECTING;
    const closeCode = WebSocket.CLOSING;
    const codeArray = [openCode, connectCode, closeCode];
    if (this.webScoket) {
      // 如果处于连接状态则彻底关闭连接并且清空引用
      if (codeArray.indexOf(this.webScoket.readyState) !== -1) {
        this.terminate();
      }
    }
    this.webScoket = new WebSocket(`${url}`);
    this.process();
  }
  /**
   * 调用该方法则关闭连接且触发close事件
   *
   * - 如果没有连接或者没有登录则该方法无效
   */
  close() {
    if (this.webScoket) {
      this.webScoket.close();
      this.terminate();
    }
  }
  /* eslint-enable */
}
