import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import AdminHeader from '../../layout/AdminHeader'
import queryClient from '../../../lib/clients/react-query'
import {fetchEvents} from '../../../lib/queries/event-queries'
import {dehydrate} from 'react-query/hydration'
import {useQuery} from 'react-query'
import Link from 'next/link'
import { Layout, Table, Space, Spin } from 'antd'

const { Content } = Layout;

const columns = [
  {
    title: 'Názov',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Začiatok',
    dataIndex: 'startDate',
    key: 'startDate',
  },
  {
    title: 'Koniec',
    dataIndex: 'endDate',
    key: 'endDate',
  },
  {
    title: 'Disciplína',
    dataIndex: 'discipline',
    key: 'discipline',
    render: (record: any) => (
      <Link href="/discipline/[id]" as={`/discipline/${record.discipline.id}`}>{record.discipline.name}</Link>
    ),
  },
  {
    title: 'Akcia',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>Editovať</a>
        <a>Vymazať</a>
      </Space>
    ),
  }
]

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session?.user || !session?.user?.email) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  if (session?.user.role != 'ADMIN' && session?.user.role != 'EDITOR') {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  await queryClient.prefetchQuery("events", fetchEvents);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const ADisciplines: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("events", fetchEvents);
  const [session] = useSession()

  let table = null
  if (isLoading) {
    table = <Spin />
  } else if (isError) {
    table = <p>Error /// {error}</p>
  } else {
    table = <Table columns={columns} dataSource={data} />
  }

  return (
    <Main
      meta={
        <Meta
          title="Spravovanie disciplín"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Naspäť na dashboard</Link>
        <h6 className="underline">List všetkých disciplín</h6>
        { session ?
          table
        : <div>Musíš byť overený aby si videl túto stránku.</div>}
      </Content>
      <Footer />
    </Main>
  )
}

export default ADisciplines