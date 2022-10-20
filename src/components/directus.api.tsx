import axios from 'axios';

export async function getFeed() {
  const result = await axios
    .get(`https://loop-markets.directus.app/items/feed?fields=*.*`);
    console.log(result.data)
  return result.data?.data;
}
