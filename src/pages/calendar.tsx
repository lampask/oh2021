import React from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import {Meta} from "../layout/Meta";
import Header from "../layout/Header";
import {Content} from "../layout/Content";
import Footer from "../layout/Footer";
import {Main} from "../layout/Main";
import {GetServerSideProps, InferGetServerSidePropsType } from "next";
import queryClient from "../../lib/clients/react-query";
import {dehydrate} from "react-query/hydration";

const locales = {
  'sk': require('date-fns/locale/sk'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
};

const BigCalendar: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let eventList: any[] = []
  return (
    <Main meta={(
      <Meta 
        title="Calendar"
        description=""
      />
    )}>
      <Header /> 
        <Content>
          <Calendar
            localizer={localizer}
            events={eventList}
            defaultDate={new Date()}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </Content>
      <Footer />
    </Main>
  )
}

export default BigCalendar;