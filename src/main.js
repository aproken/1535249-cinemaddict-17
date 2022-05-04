import ProfileRatingView from './view/profile-rating-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';

import { render } from './render.js';

import FilmsPresenter from './presenter/films-presenter.js';
import FilmDetailPresenter from './presenter/film-detail-presenter.js';
import FilmsModel from './model/films-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter();
const filmDetailPresenter = new FilmDetailPresenter();

render(new ProfileRatingView(), siteHeaderElement);
render(new FooterStatisticsView(), siteFooterElement);

filmsPresenter.init(siteMainElement, filmsModel);
filmDetailPresenter.init(siteFooterElement, filmsModel);

