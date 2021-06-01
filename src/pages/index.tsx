import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { PostList, IPostListProps } from '../components/PostList';
import { Meta } from '../layout/Meta';
import { IPaginationProps } from '../components/Pagination';
import { Main } from '../layout/Main';
import { Config } from '../utils/Config';
import prisma from '../../lib/prisma';
import { Content } from '../layout/Content';
import { Sidebar } from '../layout/Sidebar';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { CalendarWidget } from '../components/widgets/CalendarWidget';

const Index = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
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
          <PostList posts={props.posts} pagination={props.pagination} />
        </Content>
      </Sidebar>
      <Footer />
      
    </Main>
  )
};

export const getStaticProps: GetStaticProps<IPostListProps> = async () => {
  const pagination: IPaginationProps = {};
  const posts = await prisma.post.findMany({
    orderBy: [
      { createdAt: "desc" }
    ],
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    
  })

  if (posts.length > Config.pagination_size) {
    pagination.next = '/page2';
  }

  return {
    props: {
      posts: posts,
      pagination,
    },
  };
};

export default Index;
