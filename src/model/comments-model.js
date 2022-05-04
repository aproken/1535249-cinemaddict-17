import { generateComments } from '../mock/comment.js';
import { COMMENTS_COUNT } from '../const.js';

export default class CommentsModel {
  #comments = Array.from({length: COMMENTS_COUNT}, generateComments);

  get comments() {
    return this.#comments;
  }
}
