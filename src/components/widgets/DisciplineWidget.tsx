import React, { useEffect, useState } from "react";
import { Category, Post, Tag, Event } from "@prisma/client";
import {parseISO} from "date-fns";

export type DisciplineWidgetProps = {
  id: number
  name: string
  category: Category | null
  tags: Tag[]
  posts: Post[]
  events: Event[]
  deadline?: Date
};

const DisciplineWidget: React.FC<{ discipline: DisciplineWidgetProps }> = ({ discipline }) => {
  const update = () => {
    const deadline = Math.max(...discipline?.events?.map((x: Event) => parseISO(x.endDate.toString()).getTime()))
    if (deadline != undefined) {
      var difference = deadline-Date.now();
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
    <span>
      {time ? (time.status ? `Deadline: ${time.days}:${time.hours}:${time.minutes}:${time.seconds}` : "Disciplína skončila") : "Bez časového obmedzenia"}
    </span>
  );
};

export default DisciplineWidget;