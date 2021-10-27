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
import {Class, Event} from '.prisma/client'
import {useQuery} from 'react-query'
import {fetchEvents, fetchClasses} from '../../../../lib/queries/event-queries'

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

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
const ResultDraft: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading: loading, isError: iserr, data: res, error: err } = useQuery("events", fetchEvents)
  const { isLoading, isError, data, error } = useQuery("classes", fetchClasses)
  const [sub, setSub] = useState(<span>Vytvoriť</span>)

  const submitData = async(values: any) => {
    setSub(<Spin />)
    try {
      await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      await Router.push('/admin/results')
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
          title="Nový výsledok"
          description="Stránka na vytvorenie nového výsledku"
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
          <Form.Item label="Vytváranie nového">
            <span className="ant-form-text">Výsledku</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="points"
            label="Body"
            rules={[
              {
                required: true,
                message: 'Prosím zadaj body',
              },
            ]}
          >
            <Input
              autoFocus
              type="number"
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="place"
            label="Miesto"
            rules={[
              {
                required: true,
                message: 'Prosím zadaj miesto',
              },
            ]}
          >
            <Input
              autoFocus
              type="number"
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="description"
            label="Popis"
            rules={[{ required: false }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="clas"
            label="Trieda"
            hasFeedback
            rules={[{ required: true, message: 'Prosím vyber triedu', }]}
          >
            <Select placeholder="Vyber triedu">
              {
                data?.map((clas: Class) => (
                  <Option value={clas.id}>{clas.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="event"
            label="Udalosť"
            hasFeedback
            rules={[{ required: true, message: 'Prosím vyber udalosť', }]}
          >
            <Select placeholder="Vyber udalosť">
              {
                res?.map((event: Event) => (
                  <Option value={event.id}>{event.name}</Option>
                ))
              }
            </Select>
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

export default ResultDraft