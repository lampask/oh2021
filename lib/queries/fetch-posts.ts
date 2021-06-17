const fetchPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`);
  const data = await res.json();
  return data;
};

export default fetchPosts;