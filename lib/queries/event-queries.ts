export const fetchEvents = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`);
  const data = await res.json();
  return data;
};