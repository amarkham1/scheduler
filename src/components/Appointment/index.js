import React, { useEffect } from 'react';
import useVisualMode from 'hooks/useVisualMode';

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function confirmDelete() {
    transition(CONFIRM);
  }

  function destroy() {
    transition(DELETING);
    
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  function edit() {
    transition(EDIT);
  }

  return (
    <article className="appointment">
      <Header id={props.id} time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer.name}
            onDelete={confirmDelete}
            onEdit={edit}
          />
        )}
        {mode === EDIT && (
          <Form interviewers={props.interviewers} name={props.interview.student} interviewer={props.interview.interviewer.id} onCancel={back} onSave={save} />
        )}
        {mode === CREATE && (
          <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
        )}
        {mode === SAVING && <Status message={ "Saving" }/>}
        {mode === DELETING && <Status message={ "Deleting" }/>}
        {mode === CONFIRM && <Confirm message={ "Are you sure you would like to delete?" } onCancel={back} onConfirm={destroy}/>}
        {mode === ERROR_DELETE && <Error message={ "Could not delete appointment" } onClose={back} />}
        {mode === ERROR_SAVE && <Error message={ "Could not save appointment" } onClose={back} />}
    </article>
  );
};