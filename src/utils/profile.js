const ProfileRating = {
  MOVIE_BUFF: 21,
  FAN: 11,
};

export const getProfileRatingTitle = (value) => {
  if (value >= ProfileRating.MOVIE_BUFF) {
    return 'Movie Buff';
  } else if (value >= ProfileRating.FAN) {
    return 'fan';
  } else if (value >= 1) {
    return 'novice';
  }
  return '';
};
