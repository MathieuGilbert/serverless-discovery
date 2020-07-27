const axios = require('axios').default;
const querystring = require('querystring');

export const callPixabay = async (
  key: string,
  query: string,
  colors?: "grayscale" | "transparent" | "red" | "orange" | "yellow" | "green" | "turquoise" | "blue" | "lilac" | "pink" | "white" | "gray" | "black" | "brown"
) => {
  const qs = {
    key,
    q: query,
    image_type: 'photos',
    safesearch: true,
    colors,
    page: 1,
    per_page: 5,
  }

  const path = `https://pixabay.com/api/?${querystring.encode(qs)}`;
  const response = await axios.get(path);
  return response.data.hits;
}