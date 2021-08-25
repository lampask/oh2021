import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {useSession} from "next-auth/client";
import React from "react";
import {useQuery} from "react-query";
import {dehydrate} from "react-query/hydration";
import queryClient from "../../lib/clients/react-query";
import {fetchDisciplines} from "../../lib/queries/discipline-queries";
import DisciplineList, { IDisciplinesProps } from "../components/DisciplineList";
import { Content } from "../layout/Content";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Main } from "../layout/Main";
import { Meta } from "../layout/Meta";
import { Sidebar } from "../layout/Sidebar";

export const getServerSideProps: GetServerSideProps = async () => {
  await queryClient.prefetchQuery("disciplines", fetchDisciplines)
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Disciplines: React.FC<IDisciplinesProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("disciplines", fetchDisciplines)
  const [session, loading] = useSession()

  let mainContent = null
  if (isLoading || loading) {
    mainContent = <p>Loading...</p> 
  } else if (isError) {
    mainContent = <p>Error /// {error}</p>
  } else {
    let passData = {
      disciplines: data?.disciplines,
      categories: data?.categories,
      pagination: {}
    } 
    mainContent = (
      <Content>
        <DisciplineList disciplines={passData} />
      </Content>
    )
  }

  return (
    <Main
      meta={(
        <Meta
          title="Disciplines"
          description="List of all disciplines"
        />
      )}
    >
      <Header /> 
      {session ? <Sidebar
          content={
            <div className="flex flex-col">
              <h1>{session.user.class}</h1>
            </div>
          }
        >{mainContent}</Sidebar> 
      : mainContent}
      <Footer />
    </Main>
  )
};

export default Disciplines
