// pages/drafts.tsx

import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import prisma from '../../../lib/clients/prisma'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/Footer'
import AdminHeader from '../../layout/AdminHeader'
import { Content } from '../../layout/Content'
import { IPostListProps, PostList } from '../../components/PostList'
import { Config } from '../../utils/Config'
import { IPaginationProps } from '../../components/Pagination'

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

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  const pagination: IPaginationProps = {};
  if (drafts.length > Config.pagination_size) {
    pagination.next = '/page2';
  }

  return {
    props: { 
      posts: drafts,
      pagination: pagination
    },
  }
}

const Drafts: React.FC<IPostListProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session] = useSession()

  return (
    <Main
      meta={
        <Meta
          title="Drafts"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <h1>My Drafts</h1>
        { session ? 
        <PostList posts={props.posts} pagination={props.pagination}/>
        : <div>You need to be authenticated to view this page.</div>}
      </Content>
      <Footer />
    </Main>
  )
}

export default Drafts