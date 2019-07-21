'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.keyboardPress = {
    isEnter: function (evt) {
      return evt.keyCode === ENTER_KEYCODE;
    },
    isEsc: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    }
  };
})();
