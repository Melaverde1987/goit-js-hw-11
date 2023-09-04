import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const fetchImages = async (searchQuery, perPage, currentPage) => {
  const params = new URLSearchParams({
    key: '39229770-f5b3eedca6043c874392c6e75',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: perPage,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  console.log(response.data);
  return response.data;
};

export { fetchImages };
