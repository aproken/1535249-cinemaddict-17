import { createElement } from '../../render.js';

const createFormFilmDetailsTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class FormFilmsDetailsView {
  getTemplate() {
    return createFormFilmDetailsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
