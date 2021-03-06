import React from 'react';
import PropTypes from 'prop-types';
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

function InterviewerList(props) {
  const interviewerItems = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem key={interviewer.id} name={interviewer.name} avatar={interviewer.avatar} setInterviewer={event => props.setInterviewer(interviewer.id)} selected={props.interviewer === interviewer.id}/>
    );
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        { interviewerItems }
      </ul>
    </section>
  )
};

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;