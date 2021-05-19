import React from "react";
import { format } from 'date-fns';

export type EventProps = {
  id: number
  name: string
  startDate: Date
  endDate: Date
};

const Event: React.FC<{ event: EventProps }> = ({ event }) => {
  return (
    <div className="flex flex-row align-middle p-1">
      <span className="pr-2 block"> <img /> </span>
      <div className="eventInfo">
        <h2>{event.name}</h2>
        <small>{`${format(event.startDate, 'HH:mm LLL d')} - ${format(event.endDate, 'HH:mm LLL d')}`}</small>
      </div>
    </div>
  );
};

export default Event;