import {nanoid} from 'nanoid';

import { TITLES, POSTERS, DIRECTORS, WRITERS, ACTORS, RELEASE_COUNTRIES, GENRES, SAMPLE_DESCRIPTION, WRITERS_COUNT, ACTORS_COUNT, GENRES_COUNT, DESCRIPTIONS_COUNT, YEAR_RELEASE, RUNTIME } from '../const.js';

import { getRandomInteger, getRandomItem, getRandomArray, getDate } from '../utils/common.js';

import { generateComments } from './comment.js';

export const generateFilm = () => ({
  id: nanoid(),
  comments: generateComments(),
  filmInfo: {
    title: getRandomItem(TITLES),
    alternativeTitle: getRandomItem(TITLES),
    totalRating: Math.floor(Math.random() * 100) /10,
    poster: getRandomItem(POSTERS),
    ageRating: 0,
    director: getRandomItem(DIRECTORS),
    writers: getRandomArray(WRITERS, getRandomInteger(...WRITERS_COUNT)),
    actors: getRandomArray(ACTORS, getRandomInteger(...ACTORS_COUNT)),
    release: {
      date: getDate(...YEAR_RELEASE),
      releaseCountry: getRandomItem(RELEASE_COUNTRIES),
    },
    runtime: getRandomInteger(...RUNTIME),
    genre: getRandomArray(GENRES, getRandomInteger(...GENRES_COUNT)),
    description: getRandomArray(SAMPLE_DESCRIPTION, getRandomInteger(...DESCRIPTIONS_COUNT)).join(' '),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: getDate(...YEAR_RELEASE),
    favorite: Boolean(getRandomInteger(0, 1)),
  }
});

