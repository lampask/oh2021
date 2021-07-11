import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/Footer'
import AdminHeader from '../../layout/AdminHeader'
import { Content } from '../../layout/Content'
import { IPostListProps } from '../../components/PostList'
import Link from 'next/link'

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

const Dashboard: React.FC<IPostListProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
          <li><Link href="/admin/create">Create new post</Link></li>
          <li><Link href="/admin/posts">Manage posts</Link></li>
        </ul>
      </Content>
      <Footer />
    </Main>
  )
}

export default Dashboard