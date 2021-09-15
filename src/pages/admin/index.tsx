import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession, getSession } from 'next-auth/client'
import { Main } from '../../layout/Main'
import { Meta } from '../../layout/Meta'
import Footer from '../../layout/AppFooter'
import AdminHeader from '../../layout/AdminHeader'
import Link from 'next/link'
import { Layout } from 'antd'

const { Content } = Layout;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session?.user || !session?.user?.email) {
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
    props: {
    },
  }
}

const Dashboard: React.FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session] = useSession()

  return (
    <Main
      meta={
        <Meta
          title="Admin dashboard"
          description=""
        />
      }
    >
      <AdminHeader />
      <Content>
        <ul>
          Vytvoriť:
          <li><Link href="/admin/create">Vytvoriť nový príspevok</Link></li>
          <li><Link href="/admin/create/event">Vytvoriť novú udalosť</Link></li>
          <li><Link href="/admin/create/album">Vytvoriť nový album</Link></li>
          <li><Link href="/admin/create/result">Vytvoriť nový výsledok</Link></li>
          <li><Link href="/admin/create/discipline">Vytvoriť novú disciplínu</Link></li>
          Ostatné:
          <li><Link href="/admin/posts">Spravovať príspevky</Link></li>
          <li><Link href="/admin/events">Spravovať udalosti</Link></li>
          <li><Link href="/admin/results">Spravovať výsledky</Link></li>
          <li><Link href="/admin/disciplines">Spravovať disciplíny</Link></li>
          <li><Link href="/admin/q">QR Codes</Link></li>
        </ul>
      </Content>
      <Footer />
    </Main>
  )
}

export default Dashboard