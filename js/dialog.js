'use strict';

(function () {
  var Types = {
    SUCCESS: 1,
    ERROR: 2
  };

  var showDialog = function (type) {
    if (type === Types.SUCCESS) {
      elDialog = elSuccessTemplate.cloneNode(true).querySelector('.success');
      elDialogBtn = elDialog.querySelector('.success__button');
    } else {
      elDialog = elErrorTemplate.cloneNode(true).querySelector('.error');
      elDialogBtn = elDialog.querySelector('.error__button');
    }

    elMain.appendChild(elDialog);

    document.addEventListener('keydown', documentKeydownHandler);
    elDialogBtn.addEventListener('click', dialogBtnClickHandler);
    elDialog.addEventListener('click', dialogClickHandler);
  };

  var hideDialog = function () {
    if (elDialog) {
      document.removeEventListener('keydown', documentKeydownHandler);
      elDialogBtn.removeEventListener('click', dialogBtnClickHandler);
      elDialog.removeEventListener('click', dialogClickHandler);

      elMain.removeChild(elDialog);

      elDialog = null;
      elDialogBtn = null;
    }
  };

  var documentKeydownHandler = function (e) {
    if (window.keyboardPress.isEsc(e)) {
      hideDialog();
    }
  };

  var dialogClickHandler = function (e) {
    if (!e.target.closest('.success__inner')) {
      hideDialog();
    }
  };

  var dialogBtnClickHandler = function () {
    hideDialog();
  };

  var elMain = document.querySelector('main');
  var elSuccessTemplate = document.querySelector('#success').content;
  var elErrorTemplate = document.querySelector('#error').content;
  var elDialog = null;
  var elDialogBtn = null;

  window.dialog = {
    show: function (type) {
      hideDialog();
      showDialog(type);
    },
    getTypes: function () {
      return Types;
    }
  };
})();
