import React from 'react';
import classNames from 'classnames';

import 'components/DayListItems.scss';


const formatSpots = spots => {
  if (spots === 0) {
    return 'no spots remaining';
  } else if (spots === 1) {
    return '1 spot remaining';
  } else {
    return `${spots} spots remaining`;
  }
};

export default function DayListItem(props) {
  const classnames = classNames(
    'day-list__item', {
      'day-list__item--full': props.spots === 0,
      'day-list__item--selected': props.selected
    }
  );

  return (
    <li onClick={() => props.setDay(props.name)} className={classnames} data-testid="day" >
      <h2 className="text--regular">{ props.name }</h2>
      <h3 className="text--light">{ formatSpots(props.spots) }</h3>
    </li>
  );
}