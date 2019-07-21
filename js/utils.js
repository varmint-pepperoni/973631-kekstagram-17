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
    },
    getRandomNum: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min + 1;
    },
    getRandomArrValue: function (arr) {
      return arr[window.utils.getRandomNum(0, arr.length - 1)];
    }
  };
})();
