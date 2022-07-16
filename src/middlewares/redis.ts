import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
});

function set(key: any, value: any) {
  client.set(key, JSON.stringify(value));
};

async function get(key: any): Promise<any> {
  const result = await client.get(key);
  console.log(result);
};

export { client, set, get };
