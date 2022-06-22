import AbstractView from '../framework/view/abstract-view.js';

const createProfileRatingTemplate = (profileRatingTitle) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${profileRatingTitle}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileRatingView extends AbstractView {
  constructor(profileRatingTitle){
    super();
    this.profileRatingTitle = profileRatingTitle;
  }

  get template() {
    return createProfileRatingTemplate(this.profileRatingTitle);
  }
}
