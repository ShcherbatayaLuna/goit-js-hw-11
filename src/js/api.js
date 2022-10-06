import axios from 'axios';
const KEY = '30388483-557dbc66a250e34d9c6a3fc57';
const BASE_URL = 'https://pixabay.com';

const options = {
  parameters: {
    per_page: '40',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  },
};

export const fetchPictures = async (inputValue, pageNr) =>
  await axios
    .get(`${BASE_URL}/api/?key=${KEY}&q=${inputValue}&page=${pageNr}`, options)
    .then(response => {
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
