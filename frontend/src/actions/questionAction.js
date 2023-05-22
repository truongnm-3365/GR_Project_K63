import axios from '../../src/axios/axios'
import { FETCH_ALL_QUESTIONS, MARK_SOLVED_FAIL, MARK_SOLVED_REQUEST, MARK_SOLVED_SUCCESS, POST_ANSWER, POST_QUESTION } from '../constants/questionContant';

const postQuestion = (questionData) => axios.post("/api/v1/questions/Ask", questionData);

const getAllQuestions = () => axios.get("/api/v1/questions/get");

const deleteQuest = (id) => axios.delete(`/api/v1/questions/delete/${id}`);

const voteQuest = (id, value) => axios.patch(`/api/v1/questions/vote/${id}`, { value });

const postAns = (id, noOfAnswers, answerBody, userAnswered) =>
  axios.patch(`/api/v1/answer/post/${id}`, { noOfAnswers, answerBody, userAnswered });

const deleteAns = (id, answerId, noOfAnswers) =>
  axios.patch(`/api/v1/answer/delete/${id}`, { answerId, noOfAnswers });

export const askQuestion = (questionData, navigate) => async (dispatch) => {
  try {
    const { data } = await postQuestion(questionData);
    dispatch({ type: POST_QUESTION, payload: data });
    dispatch(fetchAllQuestions());
    navigate.push("/forum");
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllQuestions = () => async (disptach) => {
  try {
    const { data } = await getAllQuestions();
    disptach({ type: FETCH_ALL_QUESTIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestion = (id, navigate) => async (dispatch) => {
  try {
    await deleteQuest(id);
    dispatch(fetchAllQuestions());
    navigate.push("/forum");
  } catch (error) {
    console.log(error);
  }
};

export const markSolvedQuestion = (id,answeredUsers) => async (dispatch) => {

  try {
    dispatch({ type: MARK_SOLVED_REQUEST })
    const { data } = await axios.put(`/api/v1/questions/mark-solved/${id}`,{answeredUsers})

    dispatch({
      type: MARK_SOLVED_SUCCESS,
      payload: data.success
    })


  } catch (error) {
    dispatch({
      type: MARK_SOLVED_FAIL,
      payload: error.response?.data?.message
  })
  }
}


export const voteQuestion = (id, value) => async (dispatch) => {
  try {
    await voteQuest(id, value);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const postAnswer = (answerData) => async (dispatch) => {
  try {
    const { id, noOfAnswers, answerBody, userAnswered } = answerData;
    const { data } = await postAns(
      id,
      noOfAnswers,
      answerBody,
      userAnswered
    );
    dispatch({ type: POST_ANSWER, payload: data });
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswer = (id, answerId, noOfAnswers) => async (dispatch) => {
  try {
    await deleteAns(id, answerId, noOfAnswers);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};
