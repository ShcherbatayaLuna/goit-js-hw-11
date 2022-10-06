import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPictures } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

let inputValue = '';
let page = 1;
let totalPage = 0;
let totalRenderItem = 0;

searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  const { searchQuery } = event.target.elements;
  inputValue = searchQuery.value.trim();

  clearGallery();
  totalRenderItem = 0;
  fetch();
}

function fetch() {
  fetchPictures(inputValue, page).then(data => {
    totalPage = Math.ceil(data.totalHits / 40);

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (page !== totalPage) {
      renderPictures(data);
      observer.observe(document.querySelector('.photo-card:last-child'));
      page += 1;
    } else if (page === totalPage) {
      renderPictures(data);
    }
  });
}

function renderPictures(data) {
  const pictures = data.hits;
  const totalHits = data.totalHits;

  if (page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  appendPicturesMarkup(pictures, totalHits);
}

function appendPicturesMarkup(array, totalHits) {
  totalRenderItem += array.length;

  if (totalRenderItem === totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  const markup = array.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `<a href="${largeImageURL}">
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
    ${likes}
      <b>Likes</b>
    </p>
    <p class="info-item">
    ${views}
      <b>Views</b>
    </p>
    <p class="info-item">
    ${comments}
      <b>Comments</b>
    </p>
    <p class="info-item">
    ${downloads}
      <b>Downloads</b>
    </p>
  </div>
</div>
</a>`
  );
  galleryEl.insertAdjacentHTML('beforeend', markup.join(''));

  new SimpleLightbox('.gallery a ', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function clearGallery() {
  galleryEl.innerHTML = '';
  page = 1;
}

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        fetch();
      }
    });
  },
  {
    threshold: 0.5,
  }
);
