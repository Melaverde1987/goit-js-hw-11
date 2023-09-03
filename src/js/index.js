import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './search-api';

const elements = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

elements.form.addEventListener('submit', handlerSubmit);

let page = 1;
let perPage = 40;

async function handlerSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget;

  try {
    const result = await fetchImages(searchQuery.value);

    if (result.hits.length > 0) {
      elements.gallery.innerHTML = createMarkup(result.hits);

      if (result.totalHits > perPage) {
        elements.loadBtn.classList.remove('hidden');
        elements.loadBtn.addEventListener('click', handlerLoadMore);
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

  async function handlerLoadMore() {
    page += 1;
    const result = await fetchImages(searchQuery.value, page);
    elements.gallery.insertAdjacentHTML('beforeend', createMarkup(result.hits));

    /*
    if (data.page >= data.total_pages) {
      elements.loadBtn.classList.replace('load-more', 'load-more-hidden');
    }
    */
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
        </div>`
    )
    .join('');
}
