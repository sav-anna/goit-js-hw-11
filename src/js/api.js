import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34447533-02da5e46794bf671aeaafda8d';
export async function getAllImgs(searchQuery, page, per_Page) {
  try {
    const response = await axios.get(
      `${BASE_URL}/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_Page}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
