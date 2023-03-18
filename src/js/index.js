import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getAllImgs } from './api';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let searchQuery = '';
let page = 1;
let per_Page = 40;

searchForm.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  loadMore.classList.add('hidden');
  gallery.innerHTML = '';
  if (searchQuery === '') {
    return;
  }
  const response = await getAllImgs(searchQuery, page, per_Page);
  try {
    if (response.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createGalleryImgMarkup(response.hits);

      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

      if (response.totalHits > per_Page) {
        loadMore.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  page += 1;

  try {
    const response = await getAllImgs(searchQuery, page, per_Page);
    createGalleryImgMarkup(response.hits);

    const totalPages = Math.ceil(response.totalHits / per_Page);
    if (page >= totalPages) {
      loadMore.classList.add('hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    // прокручування сторінки
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  }
}

// Карточка картинки
function createGalleryImgMarkup(img) {
  const imgMarkup = img
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="gallery__link" href="${largeImageURL}"><div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b>${likes}</p>
        <p class="info-item"><b>Views</b>${views}</p>
        <p class="info-item"><b>Comments</b>${comments}</p>
        <p class="info-item"><b>Downloads</b>${downloads}</p>
      </div>
    </div>
  </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', imgMarkup);
  lightbox.refresh();
}
