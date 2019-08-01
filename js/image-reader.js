'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.getImageURL = function (file, onSuccess, onError) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        onSuccess(reader.result);
      });

      reader.addEventListener('error', function () {
        onError();
      });

      reader.readAsDataURL(file);
    } else {
      onError();
    }
  };
})();
