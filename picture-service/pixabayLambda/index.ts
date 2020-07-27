import { getKey } from "./getKey";
import { callPixabay } from "./callPixabay";

type event = {
  query: string,
}

exports.handler = async (event: event): Promise<any> => {
  const key = await getKey(process.env.pixabayKey!);
  const pictures = await callPixabay(key, event.query);
  return pictures;
}