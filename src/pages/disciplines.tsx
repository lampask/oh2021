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
  const [session, loading] = useSession()
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
              <div className="flex flex-col">
                <h1>{session.user.class}</h1>
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
