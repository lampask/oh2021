import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import Calendar from 'react-calendar';
import Event from '../Event'

type ICalendarProps = {
  children?: ReactNode;
};

const CalendarWidget: React.FC<ICalendarProps> = () => {
  const [value, onChange] = useState(new Date());
  return (
    <div>
      <Link href="/calendar"><h1 className="text-xl mt-3 mb-2"><a href="">Kalendár</a></h1></Link>
      <Calendar
        onChange={(date: Date[] | Date) => Array.isArray(date) ? onChange(date[0]) : onChange(date)}
        value={value}
        locale="sk-SK"
        defaultActiveStartDate={new Date()}
        defaultView="month"
        minDetail="month"
        next2Label={null}
        prev2Label={null}
      />
      <div className="flex flex-col">
        <Event event={{
          id: 1,
          name: "hahaha",
          startDate: new Date(),
          endDate: new Date()
        }} />
        <Event event={{
          id: 1,
          name: "hahaha",
          startDate: new Date(),
          endDate: new Date()
        }} />
        <Event event={{
          id: 1,
          name: "hahaha",
          startDate: new Date(),
          endDate: new Date()
        }} />
        <Event event={{
          id: 1,
          name: "hahaha",
          startDate: new Date(),
          endDate: new Date()
        }} />
      </div>
    </div>
  )
};

export { CalendarWidget };
