import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Router from 'next/router'
import { useSession } from 'next-auth/client'
import prisma from '../../../lib/clients/prisma'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import { Sidebar } from '../../layout/Sidebar'
import { markdownToHtml } from '../../utils/Markdown'
import { Content } from '../../layout/Content'
import format from 'date-fns/format'
import { Post } from '@prisma/client'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  })
  return {
    props: {
      id: post?.id,
      title: post?.title,
      image: post?.image,
      author: {
        id: post?.author.id,
        name: post?.author.name,
      },
      createdAt: post?.createdAt,
      updatedAt: post?.updatedAt,
      content: await markdownToHtml(post?.content || ""),
      published: post?.published
    }
  }
}

async function publishPost(id: number): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/publish/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function deletePost(id: number): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
    method: 'DELETE',
  })
  Router.push('/')
}

const MainPost: React.FC<(Post & {author: {name: string | null;id: number;};})> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession()
  if (loading) {
    return <div>Authenticating ...</div>
  }
  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.id === props.author?.id
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Main 
      meta={(
        <Meta
          title={title}
          description="post"
          post={{
            image: props.image,
            date: props.createdAt.toUTCString(),
            modified_date: props.updatedAt.toUTCString(),
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
          <div className="text-center text-sm">By {<a href={`/profile/${props.author?.id}`}>{props?.author?.name}</a> || 'Unknown author'}</div>
          <div className="text-center text-sm mb-8">{format(props.createdAt, 'LLLL d, yyyy')}</div>
          <div className="mx-auto xl:w-4/5">
            <hr />
            <Content styled={true} >
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: props.content }}
              />
            </Content>
            <hr />
            {
              !props.published && userHasValidSession && postBelongsToUser && (
                <button onClick={() => publishPost(props.id)}>Publish</button>
              )
            }
            {
              userHasValidSession && postBelongsToUser && (
                <button onClick={() => deletePost(props.id)}>Delete</button>
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