;(function(global) {

  var Sclazy = function(options) {
    this.init(options);
  };

  Sclazy.prototype = {
    init(options) {
      this._listeners = [];

      this.reset();

      this.target       = options.target;
      this.onload       = options.onload;
      this.onscrollend  = options.onscrollend;
      this.onpulldown   = options.onpulldown;
      this.type         = options.type || 'default';

      // 省略されていた場合は document を代入する
      if (!this.target) {
        this.target = document;
      }

      var scrollingElement = (this.target === document) ? document.documentElement : this.target;
      this.target.addEventListener('scroll', (e) => {
        var scrollTop = scrollingElement.scrollTop;

        // pull to refresh for ios
        if (scrollTop < -85) {
          this.trigger('pulldown');
        }

        if (this.isLocked()) return ;

        var max = scrollingElement.scrollHeight - scrollingElement.clientHeight-1;
        if (scrollTop >= max) {
          this.trigger('scrollend');
        }
      }, false);
    },

    getData: function(type) {
      type = type || this.type;
      return this._data[type] = this._data[type] || {
        type: type,
        items: [],
        page: 1,
        addItems: this.addItems,
        addItem: this.addItems,
      };
    },

    set items(items) {
      this.getData().items = items;
    },

    get items() {
      return this.getData().items;
    },

    set page(v) {
      this.getData().page = v;
    },

    get page() {
      return this.getData().page;
    },

    reset: function() {
      this._locked = false;
      this._more = true;
      this._data = {};

      return this;
    },

    load: function() {
      // ロック中は何もしない
      if (this.isLocked()) return ;

      this.lock();

      this.trigger('load', this.getData());
    },

    next: function(more) {
      if (more) {
        this.unlock();
      }
      else {
        this.more(false);
      }
    },

    lock: function() {
      this._locked = true;
    },

    unlock: function() {
      this._locked = false;
    },

    isLocked: function() {
      return this._locked;
    },

    more: function(more) {
      this._more = more;
      return this;
    },

    isMore: function() {
      return this._more;
    },

    addItem: function(item) {
      return this.addItems([item]);
    },

    addItems: function(items) {
      Array.prototype.push.apply(this.items, items);
      return this;
    },

    destroy() {
      
    },

    on: function(type, func) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(func);
  
      return this;
    },

    off: function(type, func) {
      if (!this._listeners[type]) this._listeners[type] = [];

      var i = this._listeners[type].indexOf(func);
      if (i !== -1) {
        this._listeners[type].splice(i, 1);
      }
  
      return this;
    },

    once: function(type, func) {
      var temp = function() {
        func.apply(this, arguments);
        this.off(type, temp);
      }.bind(this);
      this.on(type, temp);
  
      return this;
    },

    trigger: function(type, e) {
      var func = this['on' + type];
      if (func) {
        func.call(this, e);
      }

      if (!this._listeners[type]) return ;

      this._listeners[type].forEach(function(func) {
        func.call(this, e);
      }.bind(this));
  
      return this;
    },
  };

  global.Sclazy = function(options) {
    return new Sclazy(options);
  };

})(this);