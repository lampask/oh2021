import React from 'react';

import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { Pagination, IPaginationProps } from './Pagination';
import { Post } from '@prisma/client';

export type IPostListProps = {
  posts: Post[];
  pagination: IPaginationProps;
};

const PostList = (props: IPostListProps) => {
  return (
    <>
      <ul>
        {props.posts.length > 0 ? props.posts.map((elt) => (
          <li key={elt.slug} className="flex justify-between items-center">
            <Link href="/post/[id]" as={`/post/${elt.id}`}>
              <a>
                <h6>{elt.title}</h6>
              </a>
            </Link>
            <div>{typeof(elt.createdAt) != typeof("") ? format(elt.createdAt, 'LLL d, yyyy') : format(parseISO(elt.createdAt.toString()), 'LLL d, yyyy') }</div>
          </li>
        )) : null}
      </ul>

      <Pagination previous={props.pagination.previous} next={props.pagination.next} />
    </>
  )
};

export { PostList };
