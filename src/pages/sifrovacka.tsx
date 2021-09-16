import React, { useState } from 'react'
import { Main } from '../layout/Main'
import { Meta } from '../layout/Meta'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import {  Form, Select, Input, Layout, Button, Spin, message } from 'antd';
import {Sifra} from '.prisma/client'
import {useQuery} from 'react-query'
import {fetchCiphers} from '../../lib/queries/cipher-queries'
import Header from '../layout/AppHeader';
import Footer from '../layout/AppFooter';


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

  return {
    props: {}
  }
}
//props: InferGetServerSidePropsType<typeof getServerSideProps>
const sifrovacka: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data, error } = useQuery("ciphers", fetchCiphers)
  const [sub, setSub] = useState(<span>Odovzdať</span>)

  const submitData = async(values: any) => {
    try {
      setSub(<Spin />)
      const res = await fetch('/api/cipher', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await res.json()
      if (result.valid) {
        message.success("Je to dobre")
        setSub(<span>Odovzdať</span>)
      } else {
        message.error("Je to zle")
        setSub(<span>Odovzdať</span>)
      }

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
          title="Šifrovačka"
          description=""
        />
      )}
    >
      <Header/>
      <Content>
        <br/>
        <Form
          name="validate_other"
          {...formItemLayout}
          onFinish={submitData}
          initialValues={{}}
        >
          <Form.Item
            name="name"
            label="Šifra"
            hasFeedback
            rules={[{
              required: true,
              message: 'Vyber šifru',
             }]}
          >
            <Select placeholder="Vyber šifru">
              {
                data?.ciphers.map((cipher: Sifra) => (
                  <Option value={cipher.name}>{cipher.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
           <Form.Item
            {...formItemLayout}
            name="answer"
            label="Odpoveď"
            rules={[
              {
                required: true,
                message: 'Zadaj odpoveď',
              },
            ]}
          >
            <Input
              autoFocus
              type="text"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button value="primary" htmlType="submit">{sub}</Button>
          </Form.Item>
        </Form>
        <br/>
      </Content>
      <Footer />
    </Main>
  )
}

export default sifrovacka