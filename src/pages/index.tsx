import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { fetchPosts } from "../../lib/queries/post-queries";
import queryClient from "../../lib/clients/react-query";
import { PostList } from '../components/PostList';
import { Meta } from '../layout/Meta';
import { Main } from '../layout/Main';
import { Config } from '../utils/Config';
import Header from '../layout/AppHeader';
import Footer from '../layout/AppFooter';
import { CalendarWidget } from '../components/widgets/CalendarWidget';
import { dehydrate } from "react-query/hydration";
import { IPaginationProps } from '../components/Pagination';
import { Layout } from 'antd';
import dynamic from 'next/dynamic'

const { Content, Sider } = Layout;

// Needed dynamic import because spin uses useLayoutEffect which cannot be rendered on the server
const Spin = dynamic(() =>
  import('antd/lib/spin/index').then((mod: any) => mod.Spin)
)


export const getServerSideProps: GetServerSideProps = async () => {
  const pagination: IPaginationProps = {};
  await queryClient.prefetchQuery("posts", fetchPosts);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      pagination: pagination
    },
  };
};

const Index = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Main
      meta={(
        <Meta
          title="Home"
          description={Config.description}
        />
      )}
    >
      <Layout>
        <Header />
        <Layout className="limit">
          <Content className="content">
            <PostList qkey="posts" query={fetchPosts}/>
          </Content>
          <Sider className="sider" collapsedWidth="0" theme="light"><CalendarWidget /></Sider>
        </Layout>
        <Footer />
      </Layout>
    </Main>
  )
};

export default Index;
