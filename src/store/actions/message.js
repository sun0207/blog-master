
import * as types from '../types.js';
export const saveMessage = (data) => {
  return {
    type:types.MESSAGE_SAVE,
    payload:data
  }
}