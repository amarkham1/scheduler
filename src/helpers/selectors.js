// returns array of appointment objects for given day
export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }

  const appointmentsObj = state.days.filter(data => data.name === day);
  
  if (appointmentsObj.length === 0) {
    return [];
  }

  const result = appointmentsObj[0].appointments.map(number => state.appointments[number]);
  return result;
};

// returns array of interviewer objects for given day
export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }

  const appointmentsObj = state.days.filter(data => data.name === day);
  
  if (appointmentsObj.length === 0) {
    return [];
  }

  const result = appointmentsObj[0].interviewers.map(number => state.interviewers[number]);
  return result;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerDetails = state.interviewers[interview.interviewer];
  return {
    student: interview.student,
    interviewer: { ...interviewerDetails }
  };
}