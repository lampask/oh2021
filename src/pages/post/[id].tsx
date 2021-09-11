import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Header from '../../layout/AppHeader'
import Footer from '../../layout/AppFooter'
import format from 'date-fns/format'
import {deletePost, fetchPost, publishPost} from '../../../lib/queries/post-queries'
import queryClient from '../../../lib/clients/react-query'
import { dehydrate } from 'react-query/hydration'
import {useMutation, useQuery} from 'react-query'
import {parseISO} from 'date-fns'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import emoji from 'remark-emoji'
import { Button, Layout, PageHeader, Spin } from 'antd'
import { useRouter } from 'next/router'
import skLocale from 'date-fns/locale/sk';

const { Content, Sider } = Layout;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await queryClient.prefetchQuery(["post", Number(params?.id) || -1], () => fetchPost(Number(params?.id) || -1));
  return {
    props: {
      id: Number(params?.id) || -1,
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const MainPost: React.FC<{id: Number}> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession()
  const router = useRouter()
  const { isLoading, isError, data, error } = useQuery(["post", props.id], () => fetchPost(props.id));
  const publishP = useMutation(id => publishPost(Number(id)))
  const deleteP = useMutation(id => deletePost(Number(id)))

  if (loading || isLoading) {
    return <Spin />
  }
  if (isError) {
    return <div>Error /// {error}</div>
  }

  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.id === data?.author?.id
  
  let title = data?.title
  if (!data?.published) {
    title = `${title} (Draft)`
  }
  let date = data?.createdAt

  console.log(data)

  return (
    <Main 
      meta={(
        <Meta
          title={title}
          description="post"
          post={{
            image: data?.image,
            date: parseISO(data?.createdAt).toUTCString(),
            modified_date: parseISO(data?.updatedAt).toUTCString(),
          }}
        />
      )}
    >
      <Layout>
        <Header />
        <Layout>
          <Content className="content">
            <PageHeader
              className="site-page-header"
              onBack={() => router.back()}
              title={title}
              subTitle={<>By {<a href={`/profile/${data?.author?.id}`}>{data?.author?.name}</a> || 'Unknown author'}</>}
            />
            <div className="post">
              <div>{format(parseISO(date), 'd LLLL, yyyy', { locale: skLocale })}</div>
              <hr />
              <ReactMarkdown remarkPlugins={[gfm, emoji]} children={data?.content} />
              <hr />
              <>
              {
                !data?.published && ((userHasValidSession && postBelongsToUser) || session?.user.role == 'ADMIN' ) && (
                  <Button onClick={() => publishP.mutate(props.id)}>Publish</Button>
                )
              }
              { "  " }
              {
                ((userHasValidSession && postBelongsToUser) || session?.user.role == 'ADMIN' ) && (
                  <Button onClick={() => deleteP.mutate(props.id)}>Edit</Button>
                )
              }
              { "  " }
              {
                ((userHasValidSession && postBelongsToUser) || session?.user.role == 'ADMIN' ) && (
                  <Button onClick={() => deleteP.mutate(props.id)}>Delete</Button>
                )
              }
              </>
            </div>
          </Content>
          <Sider className="sider" collapsedWidth="0" theme="light">sijfdjdaoa</Sider>
        </Layout>
        <Footer />
      </Layout>
    </Main>
  )
}

export default MainPost