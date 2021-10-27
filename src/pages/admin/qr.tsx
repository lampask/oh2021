import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import AdminHeader from '../../layout/AdminHeader'
import queryClient from '../../../lib/clients/react-query'
import {fetchAdminQR} from '../../../lib/queries/event-queries'
import {dehydrate} from 'react-query/hydration'
import {useQuery} from 'react-query'
import Link from 'next/link'
import { Tag, Layout, Table, Spin } from 'antd'
import ReactMapGL, {Marker} from 'react-map-gl';
import {Code} from '.prisma/client'

const { Content } = Layout;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Triedy',
    dataIndex: 'classes',
    key: 'classes',
    render: (text, record) => (
      record.classes?.map(x => (<Tag>{x.name}</Tag>))
    ),
  },
  {
    title: 'Aktivovaný',
    dataIndex: 'active',
    key: 'active',
    render: (text, record) => (
      record.active?.toString()
    ),
  },
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

  await queryClient.prefetchQuery("QR", fetchAdminQR);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const Posts: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("QR", fetchAdminQR);
  const [session] = useSession()
  const [viewport, setViewport] = React.useState({
    longitude: 17.116206,
    latitude: 48.144058,
    zoom: 14
  });

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
          title="Spravovanie qr kódov"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content className="admin">
        <Link href="/admin">&#60;- Naspäť na dashboard</Link>
        <h6 className="underline">List všetkých qrkódov</h6>
        { session ? <>
          <ReactMapGL mapboxApiAccessToken={`${process.env.API_KEY}`} {...viewport} width="100vw" height="300px" onViewportChange={setViewport}>
            {data?.map((x: Code) => x.latitude && x.longitude ? <Marker key={x.id} latitude={x.latitude} longitude={x.longitude} offsetLeft={0} offsetTop={0}><Link href={`/q/${x.id}`}>{x.id}</Link></Marker> : null)}
          </ReactMapGL>
          <br/>
          {table}</>
        : <div>Musíš byť overený aby si videl túto stránku.</div>}
      </Content>
      <Footer />
    </Main>
  )
}

export default Posts