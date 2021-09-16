export const fetchCiphers = async () => {
  const ciphers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ciphers/`);
  const cres = await ciphers.json()
  return {ciphers: cres};
};