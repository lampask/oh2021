export const fetchDisciplines = async () => {
  const d = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discipline`);
  const c = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`);
  return {
    disciplines: await d.json(),
    categories: await c.json()
  };
};

export const fetchDiscipline = async (id: number) => {
  const disc = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discipline/${id}`);
  return await disc.json();
};
