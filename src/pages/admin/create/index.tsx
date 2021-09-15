// pages/create.tsx

import React, { useState } from 'react'
import Router from 'next/router'
import { Main } from '../../../layout/Main'
import { Meta } from '../../../layout/Meta'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import AdminHeader from '../../../layout/AdminHeader'
import Footer from '../../../layout/AppFooter'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {  Form, Select, Input, Layout, Button, Spin } from 'antd'
import {title} from 'process'
import {useQuery} from 'react-query'
import {fetchDisciplines} from '../../../../lib/queries/discipline-queries'
import {Category, Discipline} from '.prisma/client'

const { Content } = Layout;
const { Option } = Select;

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
  const { isLoading, isError, data, error } = useQuery("disciplines", fetchDisciplines)
  const [content, setContent] = useState('')
  const [sub, setSub] = useState(<span>Vytvoriť</span>)

  const submitData = async(values: any) => {
    setSub(<Spin />)
    try {
      values.content = content
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      await Router.push('/admin/posts')
    } catch (error) {
      console.error(error)
    }
  }

  const onChange = (value: string) => {
    setContent(value);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Main
      meta={(
        <Meta
          title="Nový príspevok"
          description="Stránka na vytváranie nového príspevku"
        />
      )}
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Naspäť na dashboard</Link>
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={submitData}
          initialValues={{}}
        >
          <Form.Item label="Vytváranie nového">
            <span className="ant-form-text">Príspevku</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="title"
            label="Názov"
            rules={[
              {
                required: true,
                message: 'Prosím zadaj názov',
              },
            ]}
          >
            <Input
              autoFocus
              type="text"
            />
          </Form.Item>
          <Form.Item
            name="discipline"
            label="Disciplína"
            hasFeedback
            rules={[{ required: false }]}
          >
            <Select placeholder="Vyber disciplínu">
              {
                data?.disciplines.map((discipline: Discipline) => (
                  <Option value={discipline.id}>{discipline.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="categories"
            label="Kategórie"
            rules={[{ required: false, type: 'array' }]}
          >
            <Select mode="multiple" placeholder="Vyberte kategórie">
              {
                data?.categories.map((category: Category) => (
                  <Option value={category.id}>{category.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="tags"
            label="Tagy"
            rules={[{ required: false, type: 'array' }]}
          >
            <Select mode="multiple" disabled={true} placeholder="Vyberte tagy">
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Obsah"
            rules={[{ required: true }]}
          >
            <SimpleMdeReact value={content} onChange={onChange}  />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button value="Create" htmlType="submit">{sub}</Button>
          </Form.Item>
        </Form>
        <br/>
      </Content>
      <Footer />
    </Main>
  )
}

export default Draft