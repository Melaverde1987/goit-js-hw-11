import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './search-api';

const elements = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

let page;
let perPage;
let queryValue;

elements.form.addEventListener('submit', handlerSubmit);
elements.loadBtn.addEventListener('click', handlerLoadMore);

async function handlerSubmit(evt) {
  evt.preventDefault();
  elements.loadBtn.classList.add('hidden');
  const { searchQuery } = evt.target;

  page = 1;
  perPage = 40;

  try {
    const result = await fetchImages(searchQuery.value, perPage, page);

    if (result.hits.length > 0) {
      Notify.success(`Hooray! We found ${result.totalHits} images.`);
      elements.gallery.innerHTML = createMarkup(result.hits);

      lightScroll();

      let lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      if (result.totalHits > perPage) {
        elements.loadBtn.classList.remove('hidden');
        queryValue = searchQuery.value;
        return queryValue;
      }
    } else {
      elements.gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

async function handlerLoadMore() {
  page += 1;

  try {
    const result = await fetchImages(queryValue, perPage, page);
    elements.gallery.insertAdjacentHTML('beforeend', createMarkup(result.hits));
    lightScroll();

    let lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();

    if (Math.ceil(result.totalHits / perPage) === page) {
      elements.loadBtn.classList.add('hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a class="photo-card-link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
              <p class="info-item">
                  <b>Likes</b>
                  ${likes}
              </p>
              <p class="info-item">
                  <b>Views</b>
                  ${views}
              </p>
              <p class="info-item">
                  <b>Comments</b>
                  ${comments}
              </p>
              <p class="info-item">
                  <b>Downloads</b>
                  ${downloads}
              </p>
          </div>
        </a>
      </div>`
    )
    .join('');
}

function lightScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
