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
import {AdminPostList} from '../../components/AdminPostList'
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