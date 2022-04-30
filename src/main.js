import ProfileRatingView from './view/profile-rating-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';

import { render } from './render.js';

import FilmsPresenter from './presenter/films-presenter.js';
import FilmDetailPresenter from './presenter/film-detail-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsPresenter = new FilmsPresenter();
const filmDetailPresenter = new FilmDetailPresenter();

render(new ProfileRatingView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new SortView(), siteMainElement);
render(new FooterStatisticsView(), siteFooterElement);

filmsPresenter.init(siteMainElement);
filmDetailPresenter.init(siteFooterElement);

