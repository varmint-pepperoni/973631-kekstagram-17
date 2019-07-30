'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/kekstagram';

  window.backend = {
    load: function (onLoad, onError) {
      window.load(SERVER_URL + '/data', null, 'GET', onLoad, onError);
    },
    send: function (data, onLoad, onError) {
      window.load(SERVER_URL, data, 'POST', onLoad, onError);
    }
  };
})();
