define(function() {
  var global = (function() {
    return this;
  })();

  function assert(cond, message) {
    if (typeof cond == 'function') {
      try {
        cond = cond();
      } catch(e) {
      }
    }
    if (cond)return;
    (function (console) {
      if (console.debug) console.debug('Assertion Failure:' + (message || ''));
      if (!console.debug) console.log('Assertion Failure:' + (message || ''));
      if (console.trace) console.trace();
      if (!console.trace && Error().stack) console.debug(Error().stack);
    })(global.console);
    debugger;
    // ステップアウトすると原因箇所が表示されます
  }

  function debug(callback, context) {
    var args = arguments;

    (function (console) {
      if (typeof callback !== 'function') {
        (console.debug || console.log).apply(console, args);
        return;
      }
      var context = context || global;
      if (console.debug) console.debug('debug context:', context);
      if (!console.debug) console.log('debug context:', context);

      try {
        callback.call(context, console, assert);
      } catch(e) {
        console.error(e);
      }
    })(global.console);
  }

  debug.assert = assert;

  function noDebug() {
  }

  noDebug.assert = function() {
  };

  if (global.console) {
    return debug;
  } else {
    return noDebug;
  }
});