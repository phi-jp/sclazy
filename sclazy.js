;(function(global) {

  var Sclazy = function(options) {
    this.init(options);
  };

  Sclazy.prototype = {
    init: function(options) {
      this._listeners = [];

      this.reset();

      var self = this;

      options.target.addEventListener('scroll', function(e) {
        if (self.isLocked()) return ;

        var max = e.target.scrollHeight - e.target.offsetHeight-1;
        if (e.target.scrollTop >= max) {
          self.trigger('scrollend', {
            hoge: 100,
          });
        }
      }, false);
    },

    reset: function() {
      this._locked = false;
      this._more = true;

      this.items = [];
      this.page = 1;

      return this;
    },

    load: function() {
      // ロック中は何もしない
      if (this.isLocked()) return ;

      this.lock();

      this.trigger('load');
    },

    next: function() {

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
      this.items.push(item);
      this.update();
      return this;
    },

    addItems: function(items) {
      Array.prototype.push.apply(this.items, items);
      return this;
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