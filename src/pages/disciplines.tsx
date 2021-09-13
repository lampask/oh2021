import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {useSession} from "next-auth/client";
import React from "react";
import {dehydrate} from "react-query/hydration";
import queryClient from "../../lib/clients/react-query";
import {fetchDisciplines} from "../../lib/queries/discipline-queries";
import DisciplineList from "../components/DisciplineList";
import Footer from "../layout/AppFooter";
import Header from "../layout/AppHeader";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import { Layout } from "antd";
import { Bar } from 'react-chartjs-2';
import { useQuery } from "react-query";
import { fetchResults} from "../../lib/queries/event-queries";
import {EventResult} from ".prisma/client";


const { Sider, Content  } = Layout

export const getServerSideProps: GetServerSideProps = async () => {
  await queryClient.prefetchQuery("disciplines", fetchDisciplines)
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Disciplines: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data: res, error } = useQuery("results", fetchResults)
  const [session, loading] = useSession()

  var d = [0,0,0]
  if (!isLoading && !isError && !loading) {
    const classed: Event[] = res?.filter((er: EventResult & any) => er.class?.name === session?.user.class);
    classed?.forEach((x: any) => x.place < 4 ? d[x.place-1]++ : null)
  }
  

  const data = {
    labels: ['🥇', '🥈', '🥉'],
    datasets: [
      {
        label: 'Počet umiestnení',
        data: d,
        backgroundColor: [
          'rgba(255, 0, 0, 0.5)',
          'rgba(255, 0, 0, 0.5)',
          'rgba(255, 0, 0, 0.5)',
        ],
        borderColor: [
          'rgba(255, 0, 0, 0.9)',
          'rgba(255, 0, 0, 0.9)',
          'rgba(255, 0, 0, 0.9)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  

  return (
    <Main
      meta={(
        <Meta
          title="Disciplines"
          description="List of all disciplines"
        />
      )}
    >
      <Layout>
        <Header />
        <Layout className="limit">
          {session ? <>
            <Content className="content">
              <DisciplineList/>
            </Content>
            <Sider className="sider" collapsedWidth="0" theme="light"> 
              <div className="discChart">
                <h1>Trieda - {session.user.class}</h1>
                <Bar width={300} data={data} options={options} />
              </div>
            </Sider></>
          :  <Content className="content">
          <DisciplineList/>
        </Content>}
        </Layout>
        <Footer />
      </Layout>
    </Main>
  )
};

export default Disciplines
