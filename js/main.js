'use strict';

(function () {
  var PHOTOS_COUNT = 25;

  var generatePhotos = function () {
    var photos = [];

    for (var i = 0; i < PHOTOS_COUNT; i++) {
      photos[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomNum(15, 200),
        comments: generateComments(getRandomNum(0, 5))
      };
    }

    return photos;
  };

  var generateComments = function (count) {
    var comments = [];

    for (var i = 0; i < count; i++) {
      comments[i] = generateComment();
    }

    return comments;
  };

  var generateComment = function () {
    var messages = [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
    ];
    var names = ['Артём', 'Мария', 'Василий', 'Лолита', 'Аркадий', 'Екатерина', 'Женя', 'Маша'];

    return {
      avatar: 'img/avatar-' + getRandomNum(1, 6) + '.svg',
      message: getRandomArrValue(messages),
      name: getRandomArrValue(names)
    };
  };

  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min + 1;
  }

  var getRandomArrValue = function (arr) {
    return arr[getRandomNum(0, arr.length - 1)];
  };

  var createElPhoto = function (photo) {
    var elPhoto = elPhotoTemplate.cloneNode(true);
    var elImg = elPhoto.querySelector('.picture__img');
    var elLikes = elPhoto.querySelector('.picture__likes');
    var elComments = elPhoto.querySelector('.picture__comments');

    elImg.src = photo.url;
    elLikes.textContent = photo.likes;
    elComments.textContent = photo.comments.length;

    return elPhoto;
  };

  var createElPhotos = function (arr) {
    var arrElPhotos = [];

    for (var i = 0; i < arr.length; i++) {
      arrElPhotos[i] = createElPhoto(arr[i]);
    }

    return arrElPhotos;
  };

  var insertElPhotos = function (arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(arr[i]);
    }

    elPhotosContainer.appendChild(fragment);
  };

  var elPhotoTemplate = document.querySelector('#picture').content;
  var elPhotosContainer = document.querySelector('.pictures');
  var photosData = generatePhotos();
  var arrElPhotos = createElPhotos(photosData);

  insertElPhotos(arrElPhotos);
})();

(function () {
  var EFFECTS = {
    chrome: 'grayscale(1)',
    sepia: 'sepia(1)',
    marvin: 'invert(100%)',
    phobos: 'blur(3px)',
    heat: 'brightness(3)'
  };

  var formChangeHandler = function (e) {
    if (e.target === elUploadFile) {
      openForm();
    } else if (e.target.classList.contains('effects__radio')) {
      updateEffectState();
    }
  };

  var formResetHandler = function () {
    // Обновляем форму после всплытия события.
    requestAnimationFrame(function () {
      updateForm();
    });
  };

  var imgUploadCancelClickHandler = function (e) {
    e.preventDefault();
    closeForm();
  };

  var documentKeydownHandler = function (e) {
    if (window.keyboard.isEscPressed(e)) {
      closeForm();
    }
  };

  var openForm = function () {
    if (!state.isOpened) {
      elImgUploadOverlay.classList.remove('hidden');
      elImgUploadCancel.addEventListener('click', imgUploadCancelClickHandler);
      document.addEventListener('keydown', documentKeydownHandler);
      state.isOpened = true;
    }
  };

  var closeForm = function () {
    if (state.isOpened) {
      elImgUploadOverlay.classList.add('hidden');
      elImgUploadCancel.removeEventListener('click', imgUploadCancelClickHandler);
      document.removeEventListener('keydown', documentKeydownHandler);
      elImgUploadForm.reset();
      state.isOpened = false;
    }
  };

  var updateEffectState = function () {
    var elActiveEffectRadio = getActiveEffectRadio();
    var effectValue = EFFECTS[elActiveEffectRadio.value];

    state.effect = effectValue ? elActiveEffectRadio.value : null;
    elImgUploadPreview.style.filter = effectValue || '';
  };

  var updateForm = function () {
    updateEffectState();
  };

  var getActiveEffectRadio = function () {
    var radio = null;

    for (var i = 0; i < elEffectRadios.length; i++) {
      if (elEffectRadios[i].checked) {
        radio = elEffectRadios[i];
        break;
      }
    }

    return radio;
  };

  var elUploadFile = document.querySelector('#upload-file');
  var elImgUploadForm = document.querySelector('.img-upload__form');
  var elImgUploadOverlay = elImgUploadForm.querySelector('.img-upload__overlay');
  var elImgUploadCancel = elImgUploadOverlay.querySelector('.img-upload__cancel');
  var elEffectRadios = elImgUploadOverlay.querySelectorAll('.effects__radio');
  var elImgUploadPreview = elImgUploadOverlay.querySelector('.img-upload__preview');
  var state = {
    isOpened: false,
    effect: null
  };

  elImgUploadForm.addEventListener('change', formChangeHandler);
  elImgUploadForm.addEventListener('reset', formResetHandler);
})();

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.keyboard = {
    isEnterPressed: function (evt) {
      return evt.keyCode === ENTER_KEYCODE;
    },
    isEscPressed: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    }
  };
})();
