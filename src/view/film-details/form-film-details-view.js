import { createElement } from '../../render.js';

const createFormFilmDetailsTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class FormFilmsDetailsView {
  #element = null;

  get template() {
    return createFormFilmDetailsTemplate();
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
