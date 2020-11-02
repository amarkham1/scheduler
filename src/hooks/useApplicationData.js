import { useReducer, useEffect } from 'react';
import axios from 'axios';

const GET_DAYS = "http://localhost:8001/api/days";
const GET_APPOINTMENTS = "http://localhost:8001/api/appointments";
const GET_INTERVIEWERS = "http://localhost:8001/api/interviewers";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
}

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { 
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview ? { ...action.interview } : null
      };
  
      const appointments = {
        ...state.appointments,
        [action.id]: appointment 
      };

      return {
        ...state,
        appointments,
        days: action.days
      }
  default:
    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({ type: SET_DAY, day })

  useEffect(() => {
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS),
    ]).then(all => {
      const [days, appointments, interviewers] = all;
      dispatch({ type: SET_APPLICATION_DATA, days: days.data, appointments: appointments.data, interviewers: interviewers.data });
    })
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8001");
    webSocket.onmessage = function(event) {
      const message = JSON.parse(event.data);
      if (message.type === "SET_INTERVIEW") {
        axios.get("api/days")
        .then(data => dispatch({ type: SET_INTERVIEW, interview: message.interview, days: data.data, id: message.id }));
      }
    }
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      const days = state.days.map(day => {
        if (day.name === state.day) {
          return {
            ...day,
            spots: --day.spots
          }
        }
        else {
          return day;
        }
      });
      dispatch({ type: SET_INTERVIEW, interview, days, id });
    });
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`)
    .then(() => {
      const days = state.days.map(day => {
        if (day.name === state.day) {
          return {
            ...day,
            spots: ++day.spots
          }
        }
        else {
          return day;
        }
      });
      dispatch({ type: SET_INTERVIEW, interview: null, days, id });
    })
  }

  return { state, setDay, bookInterview, cancelInterview };
}