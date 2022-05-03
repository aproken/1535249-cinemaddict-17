import { SAMPLE_DESCRIPTION, AUTHORS, EMOTIONS, COMMENTS_COUNT } from '../const.js';
import { getRandomInteger, getRandomItem } from '../utils.js';

// Функция для генерации одного комментария от случайного пользователя
const generateCommentItem = () => ({
  'id': getRandomInteger(1, AUTHORS.length),
  'author': getRandomItem(AUTHORS),
  'comment': getRandomItem(SAMPLE_DESCRIPTION),
  'date': '2019-05-11T16:12:32.554Z',
  'emotion': getRandomItem(EMOTIONS),
});

export const generateComments = () => {
  const countComments = getRandomInteger(...COMMENTS_COUNT);
  const comments = [];

  for(let i = 0; i <= countComments; i++) {
    comments.push(generateCommentItem());
  }

  return comments;
};
