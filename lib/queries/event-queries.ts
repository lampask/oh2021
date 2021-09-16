export const fetchEvents = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`);
  const data = await res.json();
  return data;
};

export const fetchClasses = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/class`);
  const data = await res.json();
  return data;
};

export const fetchResults = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/result`);
  const data = await res.json();
  return data;
};

export const fetchTags = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`);
  const data = await res.json();
  return data;
};
