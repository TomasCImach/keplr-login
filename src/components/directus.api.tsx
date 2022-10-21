import axios from 'axios';

/*
export async function NewFeedItem() {
  const result = await axios
    .post(`https://loop-markets.directus.app/items/feed?fields=*.*`);
  return result.data?.data;
}
*/
export async function getFeed() {
  const result = await axios
    .get(`https://loop-markets.directus.app/items/feed?fields=*.*`);
  return result.data?.data;
}

export async function getFeedItem(id:string) {
  const result = await axios
    .get(`https://loop-markets.directus.app/items/feed?filter[id][_eq]=${id}&fields=*.*`);
    console.log(result.data)
  return result.data?.data;
}

export async function getEventFeed(id:string) {
  const result = await axios
    .get(`https://loop-markets.directus.app/items/feed_events?filter[feed_id][_eq]=${id}&fields=*.*`);
  return result.data?.data;
}