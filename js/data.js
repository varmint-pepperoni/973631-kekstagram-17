'use strict';

(function () {
  var NEW_PHOTOS_COUNT = 10;

  var createElPhoto = function (photo) {
    var elPhoto = elPhotoTemplate.cloneNode(true);
    var elPicture = elPhoto.querySelector('.picture');
    var elImg = elPhoto.querySelector('.picture__img');
    var elLikes = elPhoto.querySelector('.picture__likes');
    var elComments = elPhoto.querySelector('.picture__comments');

    elPicture.dataset.id = photo.id;
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

    arr.forEach(function (elPhoto) {
      fragment.appendChild(elPhoto);
    });

    clearPhotosContainer();
    elPhotosContainer.appendChild(fragment);
  };

  var clearPhotosContainer = function () {
    var elPhotos = elPhotosContainer.querySelectorAll('.picture');

    Array.prototype.forEach.call(elPhotos, function (elPhoto) {
      elPhotosContainer.removeChild(elPhoto);
    });
  };

  var successPhotosLoadHandler = function (photosArray) {
    savePhotos(photosArray);
    redrawPhotos();
    showFilters();

    elPhotosContainer.addEventListener('click', photosContainerClickHandler);
  };

  var savePhotos = function (photosArray) {
    photos = photosArray;
    photos.forEach(function (photo) {
      photo.id = photo.url;
    });
  };

  var redrawPhotos = function () {
    var arrElPhotos = createElPhotos(getFilteredPhotos());

    insertElPhotos(arrElPhotos);
  };

  var getFilteredPhotos = function () {
    var filterIDToFilterFn = {
      'filter-new': getNewPhotos,
      'filter-discussed': getDiscussedPhotos
    };

    if (filterIDToFilterFn[filterID]) {
      return filterIDToFilterFn[filterID]();
    }

    return photos;
  };

  var getNewPhotos = function () {
    var newPhotos = [];
    var newPhoto = null;

    for (var i = 0; i < NEW_PHOTOS_COUNT; i++) {
      do {
        newPhoto = window.utils.getRandomArrValue(photos);

        if (newPhotos.indexOf(newPhoto) >= 0) {
          newPhoto = null;
        }
      } while (!newPhoto);

      newPhotos.push(newPhoto);
    }

    return newPhotos;
  };

  var getDiscussedPhotos = function () {
    if (!getDiscussedPhotos.sortedPhotos) {
      getDiscussedPhotos.sortedPhotos = photos.slice(0).sort(function (a, b) {
        if (a.comments.length < b.comments.length) {
          return 1;
        }
        if (a.comments.length > b.comments.length) {
          return -1;
        }
        return 0;
      });
    }

    return getDiscussedPhotos.sortedPhotos;
  };

  var showFilters = function () {
    elFilters.classList.remove('img-filters--inactive');
    elFilters.addEventListener('click', elFiltersClickHandler);
  };

  var elFiltersClickHandler = function (e) {
    if (e.target.classList.contains('img-filters__button')) {
      setActiveFilter(e.target.id);
    }
  };

  var showBigPhoto = function (photo) {
    elBigPictureImg.src = photo.url;
    elLikesCount.textContent = photo.likes;
    elCommentsCount.textContent = photo.comments.length;
    elSocialComments.innerHTML = '';
    insertComments(photo.comments);
    elSocialCaption.textContent = photo.description;
    elSocialCommentsCount.classList.add('visually-hidden');
    elCommentsLoader.classList.add('visually-hidden');

    elBigPicture.classList.remove('hidden');

    elBigPictureCancel.addEventListener('click', bigPictureCancelClickHandler);
    document.addEventListener('keydown', documentKeydownHandler);
  };

  var documentKeydownHandler = function (e) {
    var isEsc = window.keyboardPress.isEsc(e);

    if (isEsc) {
      hideBigPhoto();
    }
  };

  var bigPictureCancelClickHandler = function () {
    hideBigPhoto();
  };

  var hideBigPhoto = function () {
    elBigPicture.classList.add('hidden');

    elBigPictureCancel.removeEventListener('click', bigPictureCancelClickHandler);
    document.removeEventListener('keydown', documentKeydownHandler);
  };

  var insertComments = function (comments) {
    var fragment = document.createDocumentFragment();

    comments.forEach(function (comment) {
      fragment.appendChild(createElComment(comment));
    });

    elSocialComments.appendChild(fragment);
  };

  var createElComment = function (comment) {
    var elComment = elCommentTemplate.cloneNode(true);
    var elCommentAvatar = elComment.querySelector('.social__picture');
    var elCommentText = elComment.querySelector('.social__text');

    elCommentAvatar.src = comment.avatar;
    elCommentText.textContent = comment.message;

    return elComment;
  };

  var setActiveFilter = function (newFilterID) {
    if (filterID !== newFilterID) {
      filterID = newFilterID;

      Array.prototype.forEach.call(elFilterBtns, function (elBtn) {
        elBtn.classList.toggle('img-filters__button--active', elBtn.id === filterID);
      });

      updatePhotos();
    }
  };

  var ajaxErrorHandler = function (errorMessage) {
    window.error(errorMessage);
  };

  var photosContainerClickHandler = function (e) {
    var elPhoto = e.target.closest('.picture');

    if (elPhoto) {
      e.preventDefault();

      var photoData = findPhotoData(elPhoto.dataset.id);

      if (photoData) {
        showBigPhoto(photoData);
      }
    }
  };

  var findPhotoData = function (id) {
    return photos.find(function (photo) {
      return photo.id === id;
    });
  };

  var elPhotoTemplate = document.querySelector('#picture').content;
  var elPhotosContainer = document.querySelector('.pictures');
  var elFilters = document.querySelector('.img-filters');
  var elFilterBtns = document.querySelectorAll('.img-filters__button');
  var elBigPicture = document.querySelector('.big-picture');
  var elBigPictureImgWrapper = elBigPicture.querySelector('.big-picture__img');
  var elBigPictureImg = elBigPictureImgWrapper.querySelector('img');
  var elBigPictureCancel = elBigPicture.querySelector('.big-picture__cancel');
  var elLikesCount = elBigPicture.querySelector('.likes-count');
  var elCommentsCount = elBigPicture.querySelector('.comments-count');
  var elSocialComments = elBigPicture.querySelector('.social__comments');
  var elSocialCommentsCount = elBigPicture.querySelector('.social__comment-count');
  var elCommentsLoader = elBigPicture.querySelector('.comments-loader');
  var elSocialCaption = elBigPicture.querySelector('.social__caption');
  var elCommentTemplate = document.querySelector('#comment').content;
  var photos = [];
  var filterID = 'filter-popular';
  var updatePhotos = window.debounce(redrawPhotos);

  window.backend.load(successPhotosLoadHandler, ajaxErrorHandler);
})();
