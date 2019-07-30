'use strict';

// https://developer.mozilla.org/ru/docs/Web/API/Element/closest#Specification
(function (e) {
  e.closest = e.closest || function (css) {
    var node = this;

    while (node) {
      if (node.matches(css)) {
        return node;
      } else {
        node = node.parentElement;
      }
    }
    return null;
  };
})(Element.prototype);
