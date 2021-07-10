import axios from "axios";

export const fetchProfilePicture = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/picture`, {responseType: 'arraybuffer'});
  return Buffer.from(res.data, 'binary').toString('base64');
};

export const fetchProfile = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {responseType: 'json'});
  return res.data;
}

export const fetchProfileById = async (id: Number) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/${id}`, {responseType: 'json'});
  return res.data;
}