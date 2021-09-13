import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import AdminHeader from '../../layout/AdminHeader'
import Link from 'next/link'
import { Layout } from 'antd'

const { Content } = Layout;

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

  return {
    props: { 
    },
  }
}

const Dashboard: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session] = useSession()

  return (
    <Main
      meta={
        <Meta
          title="Admin dashpoard"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <ul>
          <li>Create:</li>
          <li><Link href="/admin/create/result">Create new album</Link></li>
          <li><Link href="/admin/create/result">Create new result</Link></li>
          <li><Link href="/admin/create/discipline">Create new discipline</Link></li>
          <li><Link href="/admin/create/event">Create new event</Link></li>
          <li><Link href="/admin/create">Create new post</Link></li>
          <li>Other:</li>
          <li><Link href="/admin/posts">Manage posts</Link></li>
          <li><Link href="/admin/events">Manage events</Link></li>
          <li><Link href="/admin/q">QR Codes</Link></li>
        </ul>
      </Content>
      <Footer />
    </Main>
  )
}

export default Dashboard