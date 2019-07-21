'use strict';

(function () {
  window.utils = {
    getDiapozoneValue: function (value, min, max) {
      if (value < min) {
        value = min;
      } else if (value > max) {
        value = max;
      }

      return value;
    }
  };
})();
