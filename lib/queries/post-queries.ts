export const fetchPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`);
  const data = await res.json();
  return data;
};

export const fetchAdminPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/all`);
  const data = await res.json();
  return data;
};

export const fetchPost = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);
  const data = await res.json();
  return data;
}


// MUTATIONS
export const publishPost = async (id: number) =>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/publish/${id}`, {
    method: 'PUT',
  })
  return res.status
}

export const deletePost = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
    method: 'DELETE',
  })
  return res.status
}
