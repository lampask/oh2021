import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import AdminHeader from '../../layout/AdminHeader'
import queryClient from '../../../lib/clients/react-query'
import {dehydrate} from 'react-query/hydration'
import {useQuery} from 'react-query'
import Link from 'next/link'
import Router from 'next/router'
import { Layout, Table, Space, Spin } from 'antd'
import {fetchAlbums} from '../../../lib/queries/user-queries'

const { Content } = Layout;

const columns = [
  {
    title: 'Názov',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
    render: (text, record) => (
      <Link href={record.link}>{text}</Link>
    )
  },
  {
    title: 'Akcia',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <>Editovať</>
        <a onClick={async() => {
          try {
            await fetch('/api/album', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: record.id}),
            })
            await Router.push('/admin/albums')
          } catch (error) {
            console.error(error)
          }
        }}>Vymazať</a>
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

  await queryClient.prefetchQuery("albums", fetchAlbums);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const Albums: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("albums", fetchAlbums);
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
          title="Spravovanie albumov"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Naspäť na dashboard</Link>
        <h6 className="underline">List všetkých albumov</h6>
        { session ?
          table
        : <div>Musíš byť overený aby si videl túto stránku.</div>}
      </Content>
      <Footer />
    </Main>
  )
}

export default Albums