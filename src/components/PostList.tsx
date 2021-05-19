import React from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { Pagination, IPaginationProps } from './Pagination';
import { Post } from '@prisma/client';

export type IPostListProps = {
  posts: Post[];
  pagination: IPaginationProps;
};

const PostList = (props: IPostListProps) => (
  <>
    <ul>
      {props.posts.length > 0 ? props.posts.map((elt) => (
        <li key={elt.slug} className="mb-3 flex justify-between">
          <Link href="/post/[id]" as={`/post/${elt.id}`}>
            <a>
              <h2>{elt.title}</h2>
            </a>
          </Link>

          <div>{format(elt.createdAt, 'LLL d, yyyy')}</div>
        </li>
      )) : null}
    </ul>

    <Pagination previous={props.pagination.previous} next={props.pagination.next} />
  </>
);

export { PostList };
