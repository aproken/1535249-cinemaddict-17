import AbstractView from '../framework/view/abstract-view.js';
import { FILMS_COUNT } from '../const.js';

const createFooterStatisticsTemplate = () => (
  `<section class="footer__statistics">
    <p>${FILMS_COUNT} movies inside</p>
  </section>`
);

export default class FooterStatisticsView extends AbstractView {
  #film = null;

  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#film);
  }
}
