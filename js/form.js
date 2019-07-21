'use strict';

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
  var EFFECT_INITIAL = 'none';

  var formChangeHandler = function (e) {
    if (e.target.classList.contains('img-upload__input')) {
      openForm();
    } else if (e.target.classList.contains('effects__radio')) {
      state.effectActiveRadioValue = e.target.value;
      updateEffect();
    } else if (e.target.classList.contains('scale__control--value')) {
      updateScale();
    } else if (e.target.classList.contains('effect-level__value')) {
      updateSaturation();
    }
  };

  var formResetHandler = function () {
    state.effectActiveRadioValue = EFFECT_INITIAL;
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

  var saturationLineMousedownHandler = function (e) {
    setSaturationByEvent(e);
    document.addEventListener('mousemove', windowMousemoveHandler);
    document.addEventListener('mouseup', windowMouseupHandler);
  };

  var windowMousemoveHandler = function (e) {
    setSaturationByEvent(e);
  };

  var windowMouseupHandler = function (e) {
    setSaturationByEvent(e);
    document.removeEventListener('mousemove', windowMousemoveHandler);
    document.removeEventListener('mouseup', windowMouseupHandler);
  };

  var setSaturationByEvent = function (e) {
    var boundingClientRect = elSaturationLine.getBoundingClientRect();
    var xDiff = e.clientX - boundingClientRect.x;
    var saturation = Math.round(xDiff / boundingClientRect.width * 100);

    setSaturation(saturation);
  };

  var openForm = function () {
    if (!state.isFormOpened) {
      toggleForm();
    }
  };

  var closeForm = function () {
    if (state.isFormOpened) {
      toggleForm();
    }
  };

  var toggleForm = function () {
    state.isFormOpened = !state.isFormOpened;
    elImgUploadOverlay.classList.toggle('hidden', !state.isFormOpened);
    toggleFormHandlers();

    if (!state.isFormOpened) {
      elImgUploadForm.reset();
    }
  };

  var toggleFormHandlers = function () {
    if (state.isFormOpened) {
      elImgUploadCancel.addEventListener('click', imgUploadCancelClickHandler);
      document.addEventListener('keydown', documentKeydownHandler);
      elScaleSmaller.addEventListener('click', scaleSmallerClickHandler);
      elScaleBigger.addEventListener('click', scaleBiggerClickHandler);
      elSaturationLine.addEventListener('mousedown', saturationLineMousedownHandler);
    } else {
      elImgUploadCancel.removeEventListener('click', imgUploadCancelClickHandler);
      document.removeEventListener('keydown', documentKeydownHandler);
      elScaleSmaller.removeEventListener('click', scaleSmallerClickHandler);
      elScaleBigger.removeEventListener('click', scaleBiggerClickHandler);
      elSaturationLine.removeEventListener('mousedown', saturationLineMousedownHandler);
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
    var effectParams = effects[state.effectActiveRadioValue];

    if (state.effect !== state.effectActiveRadioValue) {
      state.effect = effectParams ? state.effectActiveRadioValue : '';
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

  var elImgUploadForm = document.querySelector('.img-upload__form');
  var elImgUploadOverlay = elImgUploadForm.querySelector('.img-upload__overlay');
  var elImgUploadCancel = elImgUploadOverlay.querySelector('.img-upload__cancel');
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
    effectActiveRadioValue: EFFECT_INITIAL,
    scale: SCALE_INITIAL,
    saturation: SATURATION_INITIAL,
    filter: ''
  };

  elImgUploadForm.addEventListener('change', formChangeHandler);
  elImgUploadForm.addEventListener('reset', formResetHandler);
})();
