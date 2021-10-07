import React from "react";
import {Meta} from "../layout/Meta";
import Header from "../layout/AppHeader";
import Footer from "../layout/AppFooter";
import {Main} from "../layout/Main";
import {GetServerSideProps, InferGetServerSidePropsType } from "next";
import queryClient from "../../lib/clients/react-query";
import {dehydrate} from "react-query/hydration";
import { Layout, Calendar, Badge } from "antd";
import {Event} from ".prisma/client";
import {useQuery} from 'react-query';
import {fetchEvents} from "../../lib/queries/event-queries";
import {parseISO} from "date-fns";

const { Content } = Layout


export const getServerSideProps: GetServerSideProps = async () => {
  await queryClient.prefetchQuery("events", fetchEvents);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
};

const BigCalendar: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("events", fetchEvents);

  function dateCellRender(value: moment.Moment) {
    let d = value.toDate();
    d.setHours(0,0,1,1);
    return (
      <ul className="bigEvents">
        {data?.map((event: Event) =>{
          let s = parseISO(event.startDate.toString())
          let e = parseISO(event.endDate.toString())
          s.setHours(0,0,1,1);
          e.setHours(0,0,1,1);
          if (s <= d && d <= e) {
          return (
            <li key={event.id}>
               <Badge color={event.color!} status="default" text={event.name} />
            </li>
          )
        }})}
      </ul>
    );
  }

  function getMonthData(value: moment.Moment) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value: moment.Moment) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  return (
    <Main meta={(
      <Meta
        title="Kalendár"
        description="Kalendár udalostí"
      />
    )}>
      <Layout>
        <Header />
          <Content>
          <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
          </Content>
        <Footer />
      </Layout>
    </Main>
  )
}

export default BigCalendar;