'use strict';

(function () {
  var PHOTOS_COUNT = 25;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENTS = 0;
  var MAX_COMMENTS = 5;
  var FIRST_AVATAR_INDEX = 1;
  var LAST_AVATAR_INDEX = 6;

  var generatePhotos = function () {
    var photos = [];

    for (var i = 0; i < PHOTOS_COUNT; i++) {
      photos.push({
        url: 'photos/' + (i + 1) + '.jpg',
        likes: window.utils.getRandomNum(MIN_LIKES, MAX_LIKES),
        comments: generateComments(window.utils.getRandomNum(MIN_COMMENTS, MAX_COMMENTS))
      });
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
      avatar: 'img/avatar-' + window.utils.getRandomNum(FIRST_AVATAR_INDEX, LAST_AVATAR_INDEX) + '.svg',
      message: window.utils.getRandomArrValue(messages),
      name: window.utils.getRandomArrValue(names)
    };
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

    arr.forEach(function (elPhoto) {
      fragment.appendChild(elPhoto);
    });

    elPhotosContainer.appendChild(fragment);
  };

  var elPhotoTemplate = document.querySelector('#picture').content;
  var elPhotosContainer = document.querySelector('.pictures');
  var photosData = generatePhotos();
  var arrElPhotos = createElPhotos(photosData);

  insertElPhotos(arrElPhotos);
})();
