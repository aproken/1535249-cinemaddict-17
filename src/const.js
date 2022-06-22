export const TITLES = [
  'The Dance of Life',
  'Made for Each Other',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Great Flamarion',
  'The Man with the Golden Arm',
];

export const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

export const DIRECTORS = [
  'John Cromwell',
  'Dave Fleischer',
  'Armand Schaefer',
  'Nicholas Webster',
  'Anthony Mann',
  'Otto Preminger',
];

export const WRITERS = [
  'Benjamin Glazer',
  'Julian Johnson',
  'Rose Franken',
  'Jo Swerling',
  'Joe Stultz',
  'Bill Turner',
  'Jack Ward',
  'Lindsley Parsons',
];

export const ACTORS = [
  'Hal Skelly',
  'Nancy Carroll',
  'Dorothy Revier',
  'Oscar Levant',
  'Marjorie Kane',
  'Charles D. Brown',
  'Carole Lombard',
  'James Stewart',
  'Lucile Watson',
  'Ward Bond',
  'Charles Coburn',
  'Louise Beavers',
  'Yakima Canutt',
  'Wally Wales',
];

export const RELEASE_COUNTRIES = [
  'Asian',
  'Argentina',
  'Canada',
  'China',
  'England',
  'Finland',
  'France',
  'Germany',
  'Italy',
  'Japan',
  'Russia',
  'Ukraine',
  'USA',
];

export const GENRES = [
  'Drama',
  'Melodrama',
  'Comedy',
  'Cartoon',
  'Musical',
  'Mystery',
  'Western',
  'Fantasy',
  'Film-Noir',
];

export const SAMPLE_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

export const AUTHORS = [
  'Ivan Petrov',
  'Neil Armstrong',
  'Richard Wagner',
  'Robert De Niro',
  'Leonardo Dicaprio',
  'Bruce Lee',
  'Adolf Hitler',
  'Bill Gates',
  'David Beckham',
];

export const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export const WRITERS_COUNT = [1, 2];

export const ACTORS_COUNT = [5, 7];

export const GENRES_COUNT = [1, 3];

export const DESCRIPTIONS_COUNT = [3, 7];

export const MAX_LENGTH_DESCRIPTION = 140;

export const COMMENTS_COUNT = [0, 5];

export const YEAR_RELEASE = [1929, 1990];

export const YEAR_COMMENT = [2021, 2022];

export const RUNTIME = [90, 120];

export const FILMS_COUNT = 27;

export const FILM_COUNT_ON_SCREEN = 5;

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const EmptyFilterText = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  ADD_TO_ALREADY_WATCHED: 'ADD_TO_ALREADY_WATCHED',
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const EXTRA_CARDS_COUNT = 2;

/** @const {string} Класс, реализующий эффект "покачивания головой" */
export const SHAKE_CLASS_NAME = 'shake';

/** @const {number} Время анимации в миллисекундах */
export const SHAKE_ANIMATION_TIMEOUT = 600;


