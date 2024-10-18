  document.querySelector('#path').addEventListener('click', () => {
    navigateTo('/people');
  });
  
  window.addEventListener('popstate', handleRouteChange);

document.addEventListener('DOMContentLoaded', () => {
  handleRouteChange();

  document.querySelector('#prev-page').addEventListener('click', () => changePage(-1));
  document.querySelector('#next-page').addEventListener('click', () => changePage(1));

  document.querySelector('#close-modal').addEventListener('click', () => {
    toggleModal(false);
  });
});

let currentPage = 1;

function navigateTo(path) {
  window.history.pushState({}, '', path);
  handleRouteChange();
}

function handleRouteChange() {
  if (window.location.pathname === '/people') {
    fetchCharacters(currentPage);
  }
}

function changePage(increment) {
  const newPage = currentPage + increment;
  if (newPage > 0) {
    currentPage = newPage;
    fetchCharacters(currentPage);
  }
}

async function fetchCharacters(page) {
  toggleLoader(true);
  document.querySelector('#characters-container').innerHTML = '';

  try {
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    displayCharacters(data.results);

  } catch (error) {
    document.querySelector('#characters-container').innerHTML = '<p>Failed to load data.Try again.</p>';
    console.error(error);

  } finally {
    toggleLoader(false);
  }
}

function displayCharacters(characters) {
  const container = document.querySelector('#characters-container');
  container.innerHTML = '';

  characters.forEach(character => {
    const card = createCharacterCard(character);
    container.appendChild(card);
  });
}

function createCharacterCard(character) {
  const card = document.createElement('div');
  card.classList.add('character-card');
  card.textContent = character.name;
  card.addEventListener('click', () => showModal(character));
  return card;
}

function toggleModal(show) {
  document.querySelector('#character-modal').style.display = show ? 'flex' : 'none';
}

function showModal(character) {
  document.querySelector('#modal-title').textContent = character.name;
  document.querySelector('#modal-height').textContent = (character.height / 100).toFixed(2);
  document.querySelector('#modal-mass').textContent = character.mass;
  document.querySelector('#modal-date').textContent = new Date(character.created).toLocaleDateString('en-GB');
  document.querySelector('#modal-films').textContent = character.films.length;
  document.querySelector('#modal-birth-year').textContent = character.birth_year;

  toggleModal(true);
}

function toggleLoader(show) {
  document.querySelector('#loader').style.display = show ? 'block' : 'none';
}
