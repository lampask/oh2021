import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { fetchPosts } from "../../lib/queries/post-queries";
import queryClient from "../../lib/clients/react-query";
import { PostList } from '../components/PostList';
import { Meta } from '../layout/Meta';
import { Main } from '../layout/Main';
import { Config } from '../utils/Config';
import { Content } from '../layout/Content';
import { Sidebar } from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { CalendarWidget } from '../components/widgets/CalendarWidget';
import { useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import { IPaginationProps } from '../components/Pagination';

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
  const { isLoading, isError, data, error } = useQuery("posts", fetchPosts);
  return (
    <Main
      meta={(
        <Meta
          title="Home"
          description={Config.description}
        />
      )}
    >
      <Header /> 
      <Sidebar
        content={
          <CalendarWidget />
        }
      >
        <Content>
          {isLoading ? "Loading..." : (isError ? `Error ${error}` :
            <PostList posts={data} pagination={props.pagination} />
          )}
        </Content>
      </Sidebar>
      <Footer />
      
    </Main>
  )
};

export default Index;
