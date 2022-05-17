import AbstractView from '../../framework/view/abstract-view.js';

import { FilterType } from '../../const.js';

const titleType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmsListEmptyTemplate = (filterName) => (
  `<section class="films-list">
    <h2 class="films-list__title">${titleType[filterName]}</h2>
   </section>`
);

export default class NoFilmsListView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilmsListEmptyTemplate(this.#filter);
  }
}

