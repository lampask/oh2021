import Link from 'next/link';
import { Calendar, Badge, Spin } from 'antd';
import {default as Ev} from '../Event';
import React, { ReactNode, useState } from 'react'
import {useQuery} from 'react-query';
import {fetchEvents} from '../../../lib/queries/event-queries';
import { Event} from '.prisma/client';
import { parseISO } from 'date-fns';

type ICalendarProps = {
  children?: ReactNode;
};

const CalendarWidget: React.FC<ICalendarProps> = () => {
  const { isLoading, isError, data, error } = useQuery("events", fetchEvents);
  const [list, setList] = useState([])

  const changeHandler = (date: moment.Moment) => {
    let d = date.toDate();
    d.setHours(0,0,1,1);
    setList(data.filter((event: Event) => { 
      let s = parseISO(event.startDate.toString())
      let e = parseISO(event.endDate.toString())
      s.setHours(0,0,1,1);
      e.setHours(0,0,1,1);
      return s <= d && d <= e
    }))
  }

  function dateCellRender(value: moment.Moment) {
    let d = value.toDate();
    d.setHours(0,0,1,1);
    return (
      <ul className="events">
        {data?.map((event: Event) =>{
          let s = parseISO(event.startDate.toString())
          let e = parseISO(event.endDate.toString())
          s.setHours(0,0,1,1);
          e.setHours(0,0,1,1);
          if (s <= d && d <= e) {
          return (
            <li key={event.id}>
              <Badge className="calEvent" color={event.color!} status="default" />
            </li>
          )
        }})}
      </ul>
    );
  }

  return (
    <div>
      <Link href="/calendar"><h1 className="text-xl mt-3 mb-2"><a href="">Kalendár</a></h1></Link>
      <div className="site-calendar-widget">
        <Calendar fullscreen={false} dateCellRender={dateCellRender} onChange={changeHandler} />
      </div>
      <div className="eList">
        {list.length > 0 ? <br /> : null}
       {isLoading ? <Spin /> :
         list.map((e: Event) => {
          return <Ev key={e.id} event={{
            id: e.id,
            name: e.name,
            color: e.color,
            startDate: parseISO(e.startDate.toString()),
            endDate: parseISO(e.endDate.toString())
          }} />
        })
       }
      </div>
    </div>
  )
};

export { CalendarWidget };
