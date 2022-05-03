import { TITLES, POSTERS, DIRECTORS, WRITERS, ACTORS, RELEASE_COUNTRIES, GENRES, SAMPLE_DESCRIPTION, WRITERS_COUNT, ACTORS_COUNT, GENRES_COUNT, DESCRIPTIONS_COUNT, MAX_LENGTH_DESCRIPTION, COMMENTS_COUNT, YEAR_RELEASE, RUNTIME, FILM_COUNT, FILM_COUNT_ON_SCREEN } from '../const.js';

import { getRandomInteger, getRandomItem, getRandomArray, getDate } from '../utils.js';

import { generateComments } from './comment.js';

export const generateFilm = () => ({
  id: getRandomInteger(0, 999),
  comments: generateComments(),
  filmInfo: {
    title: getRandomItem(TITLES),
    alternativeTitle: 'film_info'['title'],
    totalRating: 5.3,
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

