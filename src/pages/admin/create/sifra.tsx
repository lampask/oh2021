import React, { useState } from 'react'
import Router from 'next/router'
import { Main } from '../../../layout/Main'
import { Meta } from '../../../layout/Meta'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import AdminHeader from '../../../layout/AdminHeader'
import Footer from '../../../layout/AppFooter'
import Link from 'next/link'
import {  Form, Select, Input, Layout, Button, DatePicker, Spin } from 'antd'
import {Discipline} from '.prisma/client'
import {useQuery} from 'react-query'
import {fetchDisciplines} from '../../../../lib/queries/discipline-queries'

const { Content } = Layout;
const { Option } = Select;

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
const EventDraft: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [sub, setSub] = useState(<span>Vytvoriť</span>)

  const submitData = async(values: any) => {
    setSub(<Spin />)
    try {
      await fetch('/api/cipher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      await Router.push('/admin')
    } catch (error) {
      console.error(error)
    }
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Main
      meta={(
        <Meta
          title="Nová šifra"
          description="Stránka na vytváranie novej šifry"
        />
      )}
    >
      <AdminHeader />
      <Content className="admin">
        <Link href="/admin">&#60;- Naspäť na dashboard</Link>
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={submitData}
          initialValues={{}}
        >
          <Form.Item label="Vytváranie novej">
            <span className="ant-form-text">Šifry</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="name"
            label="Meno"
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
            {...formItemLayout}
            name="answer"
            label="Riešenie"
            rules={[
              {
                required: true,
                message: 'Prosím zadaj riešenie',
              },
            ]}
          >
            <Input
              autoFocus
              type="text"
            />
          </Form.Item>
          <Form.Item
            name="start"
            label="Začiatok"
            rules={[{ required: true }]}
          >
            <DatePicker showTime />
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

export default EventDraft