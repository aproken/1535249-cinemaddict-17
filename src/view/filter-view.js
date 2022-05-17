import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#watchlist" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
