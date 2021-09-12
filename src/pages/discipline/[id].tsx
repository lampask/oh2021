import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import {fetchDiscipline} from '../../../lib/queries/discipline-queries'
import queryClient from '../../../lib/clients/react-query'
import { dehydrate } from 'react-query/hydration'
import {useQuery} from 'react-query'
import { Layout, Spin } from 'antd'
import {PostList} from '../../components/PostList'
import DisciplineHeader from '../../layout/DisciplineHeader'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import emoji from 'remark-emoji'
import {useSession} from "next-auth/client";
import {Event, EventResult} from '.prisma/client'
import DeadlineEvent from '../../components/DeadlineEvent '
import {parseISO} from 'date-fns'

const { Content, Sider } = Layout;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await queryClient.prefetchQuery(["discipline", Number(params?.id) || -1], () => fetchDiscipline(Number(params?.id) || -1));
  return {
    props: {
      id: Number(params?.id) || -1,
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const MainPost: React.FC<{id: Number}> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession()
  const { isLoading, isError, data, error } = useQuery(["discipline", props.id], () => fetchDiscipline(props.id));

  if (isLoading) {
    return <Spin />
  }
  if (isError) {
    return <div>Error /// {error}</div>
  }
  
  return (
    <Main 
      meta={(
        <Meta
          title={data?.name}
          description="discipline"
        />
      )}
    >
      <Layout>
        <DisciplineHeader discipline={data} />
        <Layout>
          <Content className="content">
            <div className="discDesc">
              <ReactMarkdown remarkPlugins={[gfm, emoji]} children={data?.description} />
              <br />
              <h3>Články súvisiace s disciplínou:</h3>
            </div>
            <PostList data={data?.posts} />
          </Content>   
          <Sider className="sider" collapsedWidth="0" theme="light">
            {session ? <div className="discResults">
              <h1>Trieda - {session?.user?.class}</h1>
              {data?.events.map((e: Event & any) => {
                return e.results.map((er: EventResult & any) => {
                  if (er.class.name === session?.user?.class) {
                    return <h5>{e.name} - {er.place}. miesto</h5>
                  }
                  return null;
                })
              })}
            </div> : null}
            <h1>Udalosti v budúcnosti</h1>
            {data?.events.map((e: Event & any) => {
              if (parseISO(e.endDate).getTime() > Date.now()) {
                return <DeadlineEvent event={e} />
              }
              return null; 
            })}
          </Sider>
        </Layout>
        <Footer />
      </Layout>
    </Main>
  )
}

export default MainPost