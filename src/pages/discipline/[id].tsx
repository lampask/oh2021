import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import { Sidebar } from '../../layout/Sidebar'
import { Content } from '../../layout/Content'
import {fetchDiscipline} from '../../../lib/queries/discipline-queries'
import queryClient from '../../../lib/clients/react-query'
import { dehydrate } from 'react-query/hydration'
import {useQuery} from 'react-query'


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
  const { isLoading, isError, data, error } = useQuery(["post", props.id], () => fetchDiscipline(props.id));

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
          title={data?.title}
          description="discipline"
        />
      )}
    >
      <Header />
      <Sidebar
        content={
          "a"
        }
      >
        <Content>

        </Content>   
      </Sidebar>
      <Footer />
    </Main>
  )
}

export default MainPost