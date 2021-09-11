import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Header from '../../layout/AppHeader'
import Footer from '../../layout/AppFooter'
import {fetchDiscipline} from '../../../lib/queries/discipline-queries'
import queryClient from '../../../lib/clients/react-query'
import { dehydrate } from 'react-query/hydration'
import {useQuery} from 'react-query'
import { Layout, Spin } from 'antd'

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
  const { isLoading, isError, data, error } = useQuery(["discipline", props.id], () => fetchDiscipline(props.id));

  if (isLoading) {
    return <div>Loading ...</div>
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
      <Header />
      <Content>
        <p>{JSON.stringify(data)}</p>
      </Content>   
      <Sider className="sider" collapsedWidth="0" theme="light">a</Sider>
      <Footer />
    </Main>
  )
}

export default MainPost