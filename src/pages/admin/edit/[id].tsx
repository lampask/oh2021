// pages/create.tsx

import React, { useState } from 'react'
import Router from 'next/router'
import { Main } from '../../../layout/Main'
import { Meta } from '../../../layout/Meta'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/client'
import AdminHeader from '../../../layout/AdminHeader'
import Footer from '../../../layout/AppFooter'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {  Form, Select, Input, Layout, Button, Spin, Tag } from 'antd'
import {fetchPost} from '../../../../lib/queries/post-queries'
import queryClient from '../../../../lib/clients/react-query'
import { dehydrate } from 'react-query/hydration'
import {useQuery} from 'react-query'
import {fetchDisciplines} from '../../../../lib/queries/discipline-queries'
import {Category, Discipline} from '.prisma/client'
import {fetchTags} from '../../../../lib/queries/event-queries'

const { Content } = Layout;
const { Option } = Select;

const SimpleMdeReact = dynamic(() => 
  import('react-simplemde-editor').then((mod) => mod.SimpleMdeReact), {
    ssr: false
  }
)


export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
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

  await queryClient.prefetchQuery(["post", Number(params?.id) || -1], () => fetchPost(Number(params?.id) || -1));
  return {
    props: {
      id: Number(params?.id) || -1,
      dehydratedState: dehydrate(queryClient)
    }
  }
}
//props: InferGetServerSidePropsType<typeof getServerSideProps>
const Edit: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession()
  const { isLoading, isError, data, error } = useQuery("disciplines", fetchDisciplines)
  const { data: pres, isLoading: propLoad } = useQuery(["post", props.id], () => fetchPost(props.id));
  const { data: tagdata } = useQuery("tags", fetchTags)
  const [sub, setSub] = useState(<span>Upraviť</span>)
  const [content, setContent] = useState(pres?.content)

  const submitData = async(values: any) => {
    setSub(<Spin/>)
    try {
      values.content = content
      await fetch(`/api/post/${pres?.id}`, {
        method: 'PATCH',
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
          title="New post"
          description="New post creation page"
        />
      )} 
    >
      <AdminHeader />
      <Content>
        <Link href="/admin">&#60;- Back to dashboard</Link>
        {!isLoading && !propLoad && !loading ? <>{pres?.author.id == session?.user.id || session?.user.role == 'ADMIN' ?
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={submitData}
          initialValues={{}}
        >
          <Form.Item label="Creating new">
            <span className="ant-form-text">Post</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="title"
            label="Názov"
            initialValue={pres?.title}
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
            initialValue={pres?.disciplines[0]?.id}
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
            initialValue={pres?.categories?.map(x => x.id)}
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
            initialValue={pres?.tags?.map(x => x.id)}
            rules={[{ required: false, type: 'array' }]}
          >
            <Select mode="multiple" placeholder="Vyberte tagy">
              {
                tagdata?.map((tag: Tag) => (
                  <Option value={tag.id}>{tag.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Obsah"
            initialValue={pres?.content}
            rules={[{ required: true }]}
          >
            <SimpleMdeReact value={content} onChange={onChange}  />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button value="Submit" htmlType="submit">{sub}</Button>
          </Form.Item>
        </Form> : <p>Na upravovanie tohoto postu nemáš dostatočné práva. (Niesi autorom)</p>}</> : <><br/><Spin/></>}
        <br/>
      </Content>
      <Footer />
    </Main>
  )
}

export default Edit