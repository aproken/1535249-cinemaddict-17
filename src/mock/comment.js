import {nanoid} from 'nanoid';

import { SAMPLE_DESCRIPTION, AUTHORS, EMOTIONS, COMMENTS_COUNT, YEAR_COMMENT } from '../const.js';
import { getRandomInteger, getRandomItem, getDate } from '../utils/common.js';

// Функция для генерации одного комментария от случайного пользователя
const generateCommentItem = () => ({
  id: nanoid(),
  author: getRandomItem(AUTHORS),
  commentText: getRandomItem(SAMPLE_DESCRIPTION),
  date: getDate(...YEAR_COMMENT),
  emotion: getRandomItem(EMOTIONS),
});

export const generateComments = () => {
  const countComments = getRandomInteger(...COMMENTS_COUNT);
  const comments = [];

  for(let i = 0; i <= countComments; i++) {
    comments.push(generateCommentItem());
  }

  return comments;
};
