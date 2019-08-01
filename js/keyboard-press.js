'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.keyboardPress = {
    isEsc: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    }
  };
})();
