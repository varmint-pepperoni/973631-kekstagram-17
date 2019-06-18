'use strict';

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
