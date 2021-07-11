import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import { Sidebar } from '../../layout/Sidebar'
import { Content } from '../../layout/Content'
import format from 'date-fns/format'
import {deletePost, fetchPost, publishPost} from '../../../lib/queries/post-queries'
import {fetchProfilePicture} from '../../../lib/queries/user-queries'
import queryClient from '../../../lib/clients/react-query'
import { dehydrate } from 'react-query/hydration'
import {useMutation, useQuery} from 'react-query'
import {parseISO} from 'date-fns'
import ReactMarkdown from 'react-markdown'

import gfm from 'remark-gfm'
import emoji from 'remark-emoji'
const collapse = require('remark-collapse')

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await queryClient.prefetchQuery(["post", Number(params?.id) || -1], () => fetchPost(Number(params?.id) || -1));
  await queryClient.prefetchQuery("picture", fetchProfilePicture);
  return {
    props: {
      id: Number(params?.id) || -1,
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const MainPost: React.FC<{id: Number}> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession()
  const { isLoading, isError, data, error } = useQuery(["post", props.id], () => fetchPost(props.id));
  const publishP = useMutation(id => publishPost(Number(id)))
  const deleteP = useMutation(id => deletePost(Number(id)))

  if (loading || isLoading) {
    return <div>Loading ...</div>
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
      <Header />
      <Sidebar
        content={
          "a"
        }
      >
        <div>
          <h2 className="text-center font-bold text-3xl text-gray-900 mt-2">{title}</h2>
          <div className="text-center text-sm">By {<a href={`/profile/${data?.author?.id}`}>{data?.author?.name}</a> || 'Unknown author'}</div>
          <div className="text-center text-sm mb-8">{format(parseISO(data?.createdAt), 'LLLL d, yyyy')}</div>
          <div className="mx-auto xl:w-4/5">
            <hr />
            <Content styled={true} >
              <ReactMarkdown remarkPlugins={[gfm, emoji, collapse]} children={data?.content} />
            </Content>
            <hr />
            {
              !data?.published && ((userHasValidSession && postBelongsToUser) || session?.user.role == 'ADMIN' ) && (
                <button onClick={() => publishP.mutate(props.id)}>Publish</button>
              )
            }
            <br />
            {
              ((userHasValidSession && postBelongsToUser) || session?.user.role == 'ADMIN' ) && (
                <button onClick={() => deleteP.mutate(props.id)}>Delete</button>
              )
            }
          </div>
        </div>
      </Sidebar>
      <Footer />
    </Main>
  )
}

export default MainPost