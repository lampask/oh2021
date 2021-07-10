import { Post } from '@prisma/client';
import { parseISO } from 'date-fns';

const fetchPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`);
  const data = await res.json();
  data.forEach((post: Post) => {
    post.createdAt = parseISO(post.createdAt.toString())
    post.updatedAt = parseISO(post.updatedAt.toString())
  });
  return data;
};

const fetchPost = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);
  const data = await res.json();
  data.createdAt = parseISO(data.createdAt.toString())
  data.updatedAt = parseISO(data.updatedAt.toString())
  return data;
}

export default fetchPosts;