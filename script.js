let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetchCharacters(currentPage);

  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchCharacters(currentPage);
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchCharacters(currentPage);
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('character-modal').style.display = 'none';
  });
});

const fetchCharacters = async (page) => {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('characters-container').innerHTML = '';
  try {
    const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();

    displayCharacters(data.results);
  } catch (error) {
    document.getElementById('characters-container').innerHTML = '<p>Failed to load data. Try again later.</p>';
  } finally {
    document.getElementById('loader').style.display = 'none';
  }
};

const displayCharacters = (characters) => {
  const container = document.getElementById('characters-container');
  container.innerHTML = '';

  characters.forEach(character => {
    const card = document.createElement('div');
    card.classList.add('character-card');
    card.textContent = character.name;
    card.addEventListener('click', () => showModal(character));
    container.appendChild(card);
  });
};

const showModal = (character) => {
  document.getElementById('modal-title').textContent = character.name;
  document.getElementById('modal-height').textContent = (character.height / 100).toFixed(2);
  document.getElementById('modal-mass').textContent = character.mass;
  document.getElementById('modal-date').textContent = new Date(character.created).toLocaleDateString('en-GB');
  document.getElementById('modal-films').textContent = character.films.length;
  document.getElementById('modal-birth-year').textContent = character.birth_year;

  document.getElementById('character-modal').style.display = 'flex';
};
