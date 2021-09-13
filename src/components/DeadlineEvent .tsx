import React, { useEffect, useState } from "react";
import { parseISO } from 'date-fns';
import { Badge } from "antd";

export type EventProps = {
  id: number
  name: string
  startDate: string
  endDate: string
  color: string
};

const DeadlineEvent: React.FC<{ event: EventProps }> = ({ event }) => {
  let ongoing = false;
  const update = () => {
    if (event.startDate != undefined) {
      var difference = parseISO(event.startDate).getTime()-Date.now();
      if (difference <= 0) {
        difference = parseISO(event.endDate).getTime()-Date.now();
        if (difference>0) {
          ongoing = true
        }
      }
      if (difference > 0) {
        return {
          status: true,
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        return {
          status: false,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      }
    } else return null
  }

  const [time, setTime] = useState(update())
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(update());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="event">
      <Badge className="calEvent" color={event.color} status="default" ></Badge>
      <h4 style={ongoing ? {fontWeight: "bold"} : {}}>{event.name}{" -  "}</h4>
      <h6>{time ? (time.status ? `${time.days}:${time.hours}:${time.minutes}:${time.seconds}` : "Udalosť skončila") : "Bez časového obmedzenia"}</h6>
    </div>
  );
};

export default DeadlineEvent;