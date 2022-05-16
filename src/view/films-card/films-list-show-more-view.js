import AbstractView from '../../framework/view/abstract-view.js';

const createFilmsListShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsListShowMoreView extends AbstractView {
  get template() {
    return createFilmsListShowMoreTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
