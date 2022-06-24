export const MAX_LENGTH_DESCRIPTION = 140;

export const FILM_COUNT_ON_SCREEN = 5;

export const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

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


