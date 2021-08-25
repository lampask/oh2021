import React, { useEffect, useState } from "react";
import { Category, Post, Tag } from "@prisma/client";
import Link from "next/link";

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
    if (discipline.deadline != undefined) {
      var difference = discipline.deadline.getTime()-Date.now();
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
    <Link href={`/discipline/${discipline.id}`}>
      <div className="flex flex-row align-middle p-1 border-2 border-gray-400 hover:bg-gray-200 cursor-pointer">
        <span className="block pr-5"><img /></span>
        <div className="flex-grow flex flex-col justify-center pr-5">
          <small>{discipline.category?.name}</small>
          <h6 className="m-0">{discipline.name}</h6>
          <small className="flex">{discipline.tags.length > 0 ? discipline.tags.map((tag: Tag) => {
            <span className="mr-1" key={tag.id}>{tag.name}</span>
          }) : null}</small>
        </div>
        <div className="flex flex-col justify-center pr-5">
          <p className="m-0">P {discipline.posts.length}</p>
          <p className="m-0">E {discipline.events.length}</p>
        </div>
        <div className="flex flex-col justify-center">
          <span>
            {time ? (time.status ? `${time.days}:${time.hours}:${time.minutes}:${time.seconds}` : "Discipline Ended") : "No deadline"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DisciplineWidget;