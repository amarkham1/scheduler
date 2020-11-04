import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer, { SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA } from "reducers/application";

const GET_DAYS = "/api/days";
const GET_APPOINTMENTS = "/api/appointments";
const GET_INTERVIEWERS = "/api/interviewers";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
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
    let update = false;
    if (state.appointments[id].interview) {
      update = true;
    }
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      const days = state.days.map(day => {
        if (day.name === state.day) {
          return {
            ...day,
            spots: update ? day.spots : --day.spots
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
    return axios.delete(`/api/appointments/${id}`)
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