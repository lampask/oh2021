import React from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { PostList, IPostListProps } from '../components/PostList';
import { Meta } from '../layout/Meta';
import { IPaginationProps } from '../components/Pagination';
import { Main } from '../layout/Main';
import { Config } from './Config';
import { getAllPosts } from './Content';
import { convertTo2D } from './Pagination';

// type IPageUrl = {
//   page: string;
// };

// const PaginatePosts = (props: IPostListProps) => (
//   <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
//     <PostList posts={props.posts} pagination={props.pagination} />
//   </Main>
// );

// export const getStaticPaths: GetStaticPaths<IPageUrl> = async () => {
//   const posts = getAllPosts(['slug']);

//   const pages = convertTo2D(posts, Config.pagination_size);

//   return {
//     paths: pages.slice(1).map((_, ind) => ({
//       params: {
//         // Ind starts from zero so we need to do ind + 1
//         // slice(1) removes the first page so we do another ind + 1
//         // the first page is implemented in index.tsx
//         page: `page${ind + 2}`,
//       },
//     })),
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps<IPostListProps, IPageUrl> = async ({ params }) => {
//   const posts = getAllPosts(['title', 'date', 'slug']);

//   const pages = convertTo2D(posts, Config.pagination_size);
//   const currentPage = Number(params!.page.replace('page', ''));
//   const currentInd = currentPage - 1;

//   const pagination: IPaginationProps = {};

//   if (currentPage < pages.length) {
//     pagination.next = `page${currentPage + 1}`;
//   }

//   if (currentPage === 2) {
//     pagination.previous = '/';
//   } else {
//     pagination.previous = `page${currentPage - 1}`;
//   }

//   return {
//     props: {
//       posts: pages[currentInd],
//       pagination,
//     },
//   };
// };

// export default PaginatePosts;
