import AbstractView from '../../framework/view/abstract-view.js';

const titleType = {
  'All movies': 'There are no movies in our database',
  'Watchlist': 'There are no movies to watch now',
  'History': 'There are no watched movies now',
  'Favorites': 'There are no favorite movies now',
};

const createFilmsListEmptyTemplate = (filter) => (
  `<section class="films-list">
    <h2 class="films-list__title">${titleType[filter]}</h2>
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

