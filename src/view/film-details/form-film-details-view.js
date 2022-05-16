import AbstractView from '../../framework/view/abstract-view.js';

const createFormFilmDetailsTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class FormFilmsDetailsView extends AbstractView {
  get template() {
    return createFormFilmDetailsTemplate();
  }
}
