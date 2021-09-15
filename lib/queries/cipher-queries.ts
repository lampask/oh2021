export const fetchCiphers = async () => {
  console.log('test')
  const ciphers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ciphers/`);
  return {ciphers: await ciphers.json()};
};