// pages/create.tsx

import React, { useState } from 'react'
import Router from 'next/router'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import AdminHeader from '../../layout/AdminHeader'
import Footer from '../../layout/Footer'
import { Content } from '../../layout/Content'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const SimpleMdeReact = dynamic(() => 
  import('react-simplemde-editor').then((mod) => mod.SimpleMdeReact), {
    ssr: false
  }
)


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  if (!session?.user) {
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
    props: {}
  }
}
//props: InferGetServerSidePropsType<typeof getServerSideProps>
const Draft: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = { title, content }
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await Router.push('/admin/posts')
    } catch (error) {
      console.error(error)
    }
  }

  const onChange = (value: string) => {
    setContent(value);
  };

  return (
    <Main
      meta={(
        <Meta
          title="New post"
          description="New post creation page"
        />
      )} 
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Back to dashboard</Link>
        <div className="mt-5">
          <form onSubmit={submitData}>
            <h6 className="underline">Create new Post</h6>
            <div className="inline-block mt-5 mb-5">
              Title:   
              <input
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                value={title}
              />
            </div>
            <SimpleMdeReact value={content} onChange={onChange} />
            <input className="p-4 ml-5" disabled={!content || !title} type="submit" value="Create" />
          </form>
        </div>
      </Content>
      <Footer />
    </Main>
  )
}

export default Draft