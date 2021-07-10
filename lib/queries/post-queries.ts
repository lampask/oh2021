
export const fetchPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`);
  const data = await res.json();
  return data;
};

export const fetchPost = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);
  const data = await res.json();
  return data;
}
