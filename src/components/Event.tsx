import React from "react";
import { format, parseISO } from 'date-fns';
import { Badge } from "antd";

export type EventProps = {
  id: number
  name: string
  startDate: Date
  endDate: Date
  color: string
};

const Event: React.FC<{ event: EventProps }> = ({ event }) => {
  console.log(event.startDate)
  return (
    <div className="event">
      <Badge color={event.color} status="default" ></Badge>
      <h4>{event.name}</h4>
      <h6>{`(${format(event.startDate, 'HH:mm LLL d')} - ${format(event.endDate, 'HH:mm LLL d')})`}</h6>
    </div>
  );
};

export default Event;