import { createElement } from '../render.js';

const createFilterTemplate = (films) => {

  const filterCount = (filterItem) => films.reduce((accumulator, item) => {
    if (item.userDetails[filterItem]) {
      accumulator += 1;
    }
    return accumulator;
  }, 0);

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filterCount('watchlist')}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filterCount('alreadyWatched')}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filterCount('favorite')}</span></a>
    </nav>`
  );
};

export default class FilterView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get template() {
    return createFilterTemplate(this.#films);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
