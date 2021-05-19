// pages/create.tsx

import React, { useState } from 'react'
import Router from 'next/router'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import AdminHeader from '../../layout/AdminHeader'
import Footer from '../../layout/Footer'
import { Content } from '../../layout/Content'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session?.user) {
    return { 
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  return {
    props: {}
  }
}

const Draft: React.FC = () => {
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
      await Router.push('/admin/drafts')
    } catch (error) {
      console.error(error)
    }
  }

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
        <div>
          <form onSubmit={submitData}>
            <h1>New Draft</h1>
            <input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
              value={title}
            />
            <textarea
              cols={50}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={8}
              value={content}
            />
            <input disabled={!content || !title} type="submit" value="Create" />
            <a className="back" href="#" onClick={() => Router.push('/')}>
              or Cancel
            </a>
          </form>
        </div>
      </Content>
      <Footer />
    </Main>
  )
}

export default Draft