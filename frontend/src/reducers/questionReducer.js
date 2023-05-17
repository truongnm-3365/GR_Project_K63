import { FETCH_ALL_QUESTIONS, MARK_SOLVED_FAIL, MARK_SOLVED_REQUEST, MARK_SOLVED_RESET, MARK_SOLVED_SUCCESS, POST_ANSWER, POST_QUESTION } from "../constants/questionContant";


const questionsReducer = (state = { data: null }, action) => {
    switch (action.type) {
      case POST_QUESTION:
        return { ...state };
      case POST_ANSWER:
        return { ...state };
      case FETCH_ALL_QUESTIONS:
        return { ...state, data: action.payload };


      default:
        return state;
    }
};

export const questionReducer = (state = {}, action) => {
  switch (action.type) {

      case MARK_SOLVED_REQUEST:
          return {
              ...state,
              loading: true
          }

      case MARK_SOLVED_SUCCESS:
          return {
              ...state,
              loading: false,
              isUpdated: action.payload
          }

      case MARK_SOLVED_FAIL:
          return {
              ...state,
              error: action.payload
          }

      case MARK_SOLVED_RESET:
          return {
              ...state,
              isUpdated: false
          }


      default:
          return state
  }
}


export default questionsReducer;