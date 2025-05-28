let images = [];

let categoryFilter = 'all';

function loadImagesFromStorage() {
  const stored = localStorage.getItem('galleryImages');
  images = stored ? JSON.parse(stored) : [];
  renderImages(categoryFilter);
}

function saveImagesToStorage() {
  localStorage.setItem('galleryImages', JSON.stringify(images));
}

function renderImages(category) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  const filtered = category === 'all' ? images : images.filter(img => img.category === category);

  filtered.forEach(({ url, category, id }) => {
    const div = document.createElement('div');
    div.classList.add('image', category);
    div.setAttribute('data-id', id);
    div.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.src = url;
    img.alt = `Image of ${category}`;
    img.loading = "lazy";

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.ariaLabel = 'Delete image';
    delBtn.onclick = () => {
      images = images.filter(i => i.id !== id);
      saveImagesToStorage();
      renderImages(categoryFilter);
    };

    div.appendChild(img);
    div.appendChild(delBtn);
    gallery.appendChild(div);
  });

  updateActiveFilterButton(category);
}

function updateActiveFilterButton(category) {
  document.querySelectorAll('nav button').forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
  });
  const active = document.querySelector(`nav button[onclick="filterImages('${category}')"]`);
  if (active) active.setAttribute('aria-pressed', 'true');
}

function filterImages(category) {
  categoryFilter = category;
  renderImages(category);
}

function addImage() {
  const urlInput = document.getElementById('imageURL');
  const category = document.getElementById('imageCategory').value;
  const url = urlInput.value.trim();

  if (!url) {
    alert('Please enter an image URL.');
    urlInput.focus();
    return;
  }

  const id = Date.now();
  images.push({ url, category, id });
  saveImagesToStorage();
  urlInput.value = '';
  filterImages(categoryFilter);
}

function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const error = document.getElementById('formError');

  if (!name || !email || !message) {
    error.textContent = 'All fields are required.';
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  if (!emailPattern.test(email)) {
    error.textContent = 'Please enter a valid email.';
    return false;
  }

  error.textContent = '';
  alert('Message sent successfully!');
  document.getElementById('contactForm').reset();
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  loadImagesFromStorage();
});