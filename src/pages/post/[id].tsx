import React from 'react'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import { PostProps } from '../../components/Post'
import { useSession } from 'next-auth/client'
import prisma from '../../../lib/prisma'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import { Sidebar } from '../../layout/Sidebar'
import { markdownToHtml } from '../../utils/Markdown'
import { Content } from '../../layout/Content'
import format from 'date-fns/format'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  return {
    props: {
      id: post?.id,
      title: post?.title,
      image: post?.image,
      author: {
        name: post?.author.name,
        email: post?.author.email
      },
      createdAt: post?.createdAt,
      updatedAt: post?.updatedAt,
      content: await markdownToHtml(post?.content || ""),
      published: post?.published
    }
  }
}

async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}

async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: 'DELETE',
  })
  Router.push('/')
}

const Post: React.FC<PostProps> = (props) => {
  const [session, loading] = useSession()
  if (loading) {
    return <div>Authenticating ...</div>
  }
  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.email === props.author?.email
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
          <div className="text-center text-sm">By {props?.author?.name || 'Unknown author'}</div>
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

export default Post