import config from "./config.json";

export const getPictures = async (term: string) => {
  const query = `
    query getPictures($query: String!) {
      getPictures(query: $query) {
          id
          tags
          previewURL
          previewWidth
          previewHeight
          webformatURL
          webformatWidth
          webformatHeight
      }
    }
  `;

  const response = await fetch(config.pictureServiceEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': config.pictureServiceKey
    },
    body: JSON.stringify({ query, variables: { query: term } })
  });

  let data = await response.json()
  return data;
}
