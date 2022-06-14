import AbstractView from '../../framework/view/abstract-view.js';

import { EmptyFilterText } from '../../const.js';

const createFilmsListEmptyTemplate = (filterName) => (
  `<section class="films-list">
    <h2 class="films-list__title">${EmptyFilterText[filterName]}</h2>
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

