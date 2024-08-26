import { Cache } from '@/server/cache';
import { delay } from 'es-toolkit';

const { INSTAGRAM_TOKEN, POST_ID } = process.env;

let fetchComment = async () => {
  try {
    let url = `https://graph.facebook.com/v20.0/${POST_ID}/comments?fields=username,text&limit=50`;
    let users = new Set<string>();

    // pagination
    while (true) {
      let resp = await fetch(url, {
        headers: { Authorization: `Bearer ${INSTAGRAM_TOKEN}` },
      });

      let json = await resp.json();

      for (let item of json.data) {
        users.add(item.username);
      }

      if (json.paging === undefined) break;
      url = json.paging.next;

      await delay(100);
    }

    return [...users];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export let fetchCache = new Cache(fetchComment, 60 * 1000);
