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
  var effects = {
    chrome: {
      fn: 'grayscale',
      min: 0,
      max: 1,
      measure: ''
    },
    sepia: {
      fn: 'sepia',
      min: 0,
      max: 1,
      measure: ''
    },
    marvin: {
      fn: 'invert',
      min: 0,
      max: 100,
      measure: '%'
    },
    phobos: {
      fn: 'blur',
      min: 0,
      max: 3,
      measure: 'px'
    },
    heat: {
      fn: 'brightness',
      min: 1,
      max: 3,
      measure: 0
    }
  };
  var SCALE_INITIAL = 100;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;
  var SATURATION_INITIAL = 100;
  var SATURATION_MIN = 0;
  var SATURATION_MAX = 100;

  var formChangeHandler = function (e) {
    if (e.target.classList.contains('img-upload__input')) {
      openForm();
    } else if (e.target.classList.contains('effects__radio')) {
      updateEffect();
    } else if (e.target.classList.contains('scale__control--value')) {
      updateScale();
    } else if (e.target.classList.contains('effect-level__value')) {
      updateSaturation();
    }
  };

  var formResetHandler = function () {
    // Обновляем форму после всплытия события.
    requestAnimationFrame(updateForm);
  };

  var imgUploadCancelClickHandler = function (e) {
    e.preventDefault();
    closeForm();
  };

  var documentKeydownHandler = function (e) {
    var isEsc = window.keyboard.isEscPressed(e);
    var isHashtags = e.target.classList.contains('text__hashtags');
    var isDescription = e.target.classList.contains('text__description');

    if (isEsc && !isHashtags && !isDescription) {
      closeForm();
    }
  };

  var scaleSmallerClickHandler = function () {
    setScale(state.scale - SCALE_STEP);
  };

  var scaleBiggerClickHandler = function () {
    setScale(state.scale + SCALE_STEP);
  };

  var saturationLineMouseupHandler = function (e) {
    var boundingClientRect = elSaturationLine.getBoundingClientRect();
    var xDiff = e.clientX - boundingClientRect.x;
    var saturation = Math.round(xDiff / boundingClientRect.width * 100);

    setSaturation(saturation);
  };

  var openForm = function () {
    if (!state.isFormOpened) {
      elImgUploadOverlay.classList.remove('hidden');
      elImgUploadCancel.addEventListener('click', imgUploadCancelClickHandler);
      document.addEventListener('keydown', documentKeydownHandler);
      elScaleSmaller.addEventListener('click', scaleSmallerClickHandler);
      elScaleBigger.addEventListener('click', scaleBiggerClickHandler);
      elSaturationLine.addEventListener('mouseup', saturationLineMouseupHandler);
      state.isFormOpened = true;
    }
  };

  var closeForm = function () {
    if (state.isFormOpened) {
      elImgUploadOverlay.classList.add('hidden');
      elImgUploadCancel.removeEventListener('click', imgUploadCancelClickHandler);
      document.removeEventListener('keydown', documentKeydownHandler);
      elScaleSmaller.removeEventListener('click', scaleSmallerClickHandler);
      elScaleBigger.removeEventListener('click', scaleBiggerClickHandler);
      elSaturationLine.removeEventListener('mouseup', saturationLineMouseupHandler);
      elImgUploadForm.reset();
      state.isFormOpened = false;
    }
  };

  var updateForm = function () {
    updateScale();
    updateEffect();
    updateSaturation();
  };

  var updateScale = function () {
    var scale = parseInt(elScaleValue.value, 10);

    scale = window.utils.getDiapozoneValue(scale, SCALE_MIN, SCALE_MAX);

    if (scale !== state.scale) {
      state.scale = scale;
      elImgUploadPreviewImg.style.transform = 'scale(' + (scale / 100) + ')';
    }
  };

  var updateEffect = function () {
    var elActiveEffectRadio = getActiveEffectRadio();
    var effectParams = effects[elActiveEffectRadio.value];

    if (state.effect !== elActiveEffectRadio.value) {
      state.effect = effectParams ? elActiveEffectRadio.value : '';
      elSaturation.classList.toggle('hidden', !state.effect);
      setSaturation(SATURATION_INITIAL);
      updateFilter();
    }
  };

  var updateSaturation = function () {
    var saturation = parseInt(elSaturationValue.value, 10);

    saturation = window.utils.getDiapozoneValue(saturation, SATURATION_MIN, SATURATION_MAX);

    if (saturation !== state.saturation) {
      state.saturation = saturation;
      elSaturationDepth.style.width = saturation + '%';
      elSaturationPin.style.left = saturation + '%';
      updateFilter();
    }
  };

  var updateFilter = function () {
    var effectParams = effects[state.effect];
    var filter = '';
    var effectSaturationValue = null;

    if (effectParams) {
      effectSaturationValue = effectParams.min + (effectParams.max - effectParams.min) * state.saturation / 100;
      filter = effectParams.fn + '(' + effectSaturationValue + effectParams.measure + ')';
    }

    if (filter !== state.filter) {
      state.filter = filter;
      elImgUploadPreview.style.filter = filter;
    }
  };

  var setScale = function (scale) {
    var correctScale = window.utils.getDiapozoneValue(scale, SCALE_MIN, SCALE_MAX);

    if (correctScale !== state.scale) {
      elScaleValue.value = correctScale + '%';
      updateScale();
    }
  };

  var setSaturation = function (saturation) {
    var correctSaturation = window.utils.getDiapozoneValue(saturation, SATURATION_MIN, SATURATION_MAX);

    if (correctSaturation !== state.saturation) {
      elSaturationValue.value = correctSaturation;
      updateSaturation();
    }
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

  var elImgUploadForm = document.querySelector('.img-upload__form');
  var elImgUploadOverlay = elImgUploadForm.querySelector('.img-upload__overlay');
  var elImgUploadCancel = elImgUploadOverlay.querySelector('.img-upload__cancel');
  var elEffectRadios = elImgUploadOverlay.querySelectorAll('.effects__radio');
  var elSaturation = elImgUploadOverlay.querySelector('.effect-level');
  var elSaturationValue = elSaturation.querySelector('.effect-level__value');
  var elSaturationLine = elSaturation.querySelector('.effect-level__line');
  var elSaturationDepth = elSaturation.querySelector('.effect-level__depth');
  var elSaturationPin = elSaturation.querySelector('.effect-level__pin');
  var elImgUploadPreview = elImgUploadOverlay.querySelector('.img-upload__preview');
  var elImgUploadPreviewImg = elImgUploadPreview.querySelector('img');
  var elScaleValue = elImgUploadOverlay.querySelector('.scale__control--value');
  var elScaleSmaller = elImgUploadOverlay.querySelector('.scale__control--smaller');
  var elScaleBigger = elImgUploadOverlay.querySelector('.scale__control--bigger');
  var state = {
    isFormOpened: false,
    effect: '',
    scale: SCALE_INITIAL,
    saturation: SATURATION_INITIAL,
    filter: ''
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
