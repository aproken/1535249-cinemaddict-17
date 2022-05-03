import { TITLES, POSTERS, DIRECTORS, WRITERS, ACTORS, RELEASE_COUNTRIES, GENRES, SAMPLE_DESCRIPTION, WRITERS_COUNT, ACTORS_COUNT, GENRES_COUNT, DESCRIPTIONS_COUNT, MAX_LENGTH_DESCRIPTION, COMMENTS_COUNT, YEAR_RELEASE, RUNTIME, FILM_COUNT, FILM_COUNT_ON_SCREEN } from '../const.js';

import { getRandomInteger, getRandomItem, getRandomArray } from '../utils.js';

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
    writers: getRandomArray(WRITERS, WRITERS_COUNT),
    actors: getRandomArray(ACTORS, ACTORS_COUNT),
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: getRandomItem(RELEASE_COUNTRIES),
    },
    runtime: getRandomItem(RUNTIME),
    genre: getRandomArray(GENRES, GENRES_COUNT),
    description: getRandomArray(SAMPLE_DESCRIPTION, DESCRIPTIONS_COUNT),
  },
});
