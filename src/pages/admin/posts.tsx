import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import AdminHeader from '../../layout/AdminHeader'
import queryClient from '../../../lib/clients/react-query'
import {fetchAdminPosts} from '../../../lib/queries/post-queries'
import {dehydrate} from 'react-query/hydration'
import {useQuery} from 'react-query'
import Link from 'next/link'
import { Tag, Layout, Space, Table, Spin } from 'antd'
import Router from 'next/router'

const { Content } = Layout;

const columns = [
  {
    title: 'Nadpis',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => (
      <span><Link href="/post/[id]" as={`/post/${record.id}`}><a>{text}</a></Link>{record.published ? null : <>    <Tag color="red">Draft</Tag></>}</span>
    ),
  },
  {
    title: 'Disciplína',
    dataIndex: 'disciplines',
    key: 'disciplines',
    render: (text, record) => (
      <Link href="/discipline/[id]" as={`/discipline/${record.disciplines[0]?.id}`}><a>{record.disciplines[0]?.name}</a></Link>
    ),
  },
  {
    title: 'Kategórie',
    dataIndex: 'categories',
    key: 'categories',
    render: (text, record) => (
      record.categories?.map(x => (<Tag>{x.name}</Tag>))
    ),
  },
  {
    title: 'Akcia',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
          {!record.published ? 
            <a onClick={async() => {
              try {
                await fetch(`/api/post/publish/${record.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                })
               queryClient.refetchQueries("adminPosts")
             } catch (error) {
               console.error(error)
             }
           }}>Publikovať</a>
          : null}
         <a onClick={async() => {
           try {
            await Router.push(`/admin/edit/${record.id}`)
          } catch (error) {
            console.error(error)
          }
        }}>Editovať</a>
        <a onClick={async() => {
          try {
            await fetch(`/api/post/${record.id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            })
            queryClient.refetchQueries("adminPosts")
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

  await queryClient.prefetchQuery("adminPosts", fetchAdminPosts);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const Posts: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("adminPosts", fetchAdminPosts);
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
          title="Spravovanie príspevkov"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Naspäť na dashboard</Link>
        <h6 className="underline">List všetkých príspevkov</h6>
        { session ?
          table
        : <div>Musíš byť overený aby si videl túto stránku.</div>}
      </Content>
      <Footer />
    </Main>
  )
}

export default Posts