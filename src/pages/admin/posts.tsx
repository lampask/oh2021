import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/Footer'
import AdminHeader from '../../layout/AdminHeader'
import { Content } from '../../layout/Content'
import { IPostListProps } from '../../components/PostList'
import queryClient from '../../../lib/clients/react-query'
import {fetchAdminPosts} from '../../../lib/queries/post-queries'
import {dehydrate} from 'react-query/hydration'
import {useQuery} from 'react-query'
import {AdminPostList} from '../../components/AdminPostList'
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

  await queryClient.prefetchQuery("adminPosts", fetchAdminPosts);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

const Posts: React.FC<IPostListProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("adminPosts", fetchAdminPosts);
  const [session] = useSession()

  let table = null
  if (isLoading) {
    table = <p>Loading...</p>
  } else if (isError) {
    table = <p>Error /// {error}</p>
  } else {
    table = <AdminPostList posts={data} pagination={{}}/>
  }

  return (
    <Main
      meta={
        <Meta
          title="Posts management"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Back to dashboard</Link>
        <h6 className="underline">List of all available posts</h6>
        { session ? 
          table
        : <div>You need to be authenticated to view this page.</div>}
      </Content>
      <Footer />
    </Main>
  )
}

export default Posts