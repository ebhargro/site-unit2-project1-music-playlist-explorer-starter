const modal = document.getElementById("playlist-modal");
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const sortSelect = document.getElementById('sort-select');

let allPlaylists = [];
let displayedPlaylists = [];
let likedPlaylists = new Set();

// Fetch and render playlists from JSON
fetch('data/data.json')
  .then(res => res.json())
  .then(data => {
    allPlaylists = data.playlists.map(p => ({
      ...p,
      dateAdded: p.dateAdded || new Date().toISOString() // Ensure date exists
    }));
    displayedPlaylists = [...allPlaylists];
    renderPlaylists(displayedPlaylists);
  });

function renderPlaylists(playlists) {
  const container = document.querySelector('.playlist-cards');
  container.innerHTML = '';

  playlists.forEach(playlist => {
    const card = document.createElement('section');
    card.classList.add('individual-card');

    card.innerHTML = `
      <img src="${playlist.playlist_art}" class="thumbnail" />
      <span class="playlist-title">${playlist.playlist_name}</span>
      <span class="creator-name">${playlist.playlist_author}</span>
      <span class="likes" data-id="${playlist.playlistID}">
        <span class="heart" style="cursor:pointer">${likedPlaylists.has(playlist.playlistID) ? '❤️' : '🤍'}</span>
        <span class="like-count">${playlist.likes}</span>
      </span>
      <button class="view-details" data-id="${playlist.playlistID}">View Details</button>
    `;

    container.appendChild(card);
  });

  attachCardListeners(playlists);
}

function attachCardListeners(playlists) {
  document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', event => {
      const id = event.target.dataset.id;
      const playlist = playlists.find(p => p.playlistID == id);
      openModal(playlist);
    });
  });

  document.querySelectorAll('.heart').forEach(heart => {
    heart.addEventListener('click', e => {
      const parent = e.target.closest('.likes');
      const id = parent.dataset.id;
      const countSpan = parent.querySelector('.like-count');
      let count = parseInt(countSpan.textContent);

      if (likedPlaylists.has(id)) {
        likedPlaylists.delete(id);
        e.target.textContent = '🤍';
        countSpan.textContent = count - 1;
      } else {
        likedPlaylists.add(id);
        e.target.textContent = '💙';
        countSpan.textContent = count + 1;
      }
    });
  });
}

function openModal(playlist) {
  const content = modal.querySelector('.modal-content');

  content.innerHTML = `
    <span class="close">&times;</span>
    <div class="modal-header">
      <img class="modal-playlist-img" src="${playlist.playlist_art}" alt="Playlist Image" />
      <div class="modal-playlist-text">
        <h2 class="playlist-title">${playlist.playlist_name}</h2>
        <p class="creator-name">${playlist.playlist_author}</p>
      </div>
    </div>
    <button class="shuffle-btn">Shuffle Songs</button>
    <div class="song-list">
      ${playlist.songs.map(song => `
        <div class="song-card">
          <img class="song-img" src="${song.cover_art}" alt="Song Image" />
          <div class="song-details">
            <p class="song-title">${song.title}</p>
            <p class="song-meta">${song.artist}<br/>${song.album}</p>
          </div>
          <div class="song-time">${song.duration}</div>
        </div>
      `).join('')}
    </div>
  `;

  modal.style.display = 'block';

  modal.querySelector('.close').onclick = () => {
    modal.style.display = 'none';
  };

  modal.querySelector('.shuffle-btn').onclick = () => {
    playlist.songs = [...playlist.songs].sort(() => Math.random() - 0.5);
    openModal(playlist); // Rerender modal with shuffled songs
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function handleSearch() {
    const term = searchInput.value.trim().toLowerCase();
  if (!term) return;
  displayedPlaylists = allPlaylists.filter(p =>
    p.playlist_name.toLowerCase().includes(term) ||
    p.playlist_author.toLowerCase().includes(term)
  );
  renderPlaylists(displayedPlaylists);
}

searchBtn.addEventListener('click', () => {
    handleSearch();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
})

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  displayedPlaylists = [...allPlaylists];
  renderPlaylists(displayedPlaylists);
});


sortSelect.addEventListener('change', (e) => {
  const value = e.target.value;
  let sorted = [...displayedPlaylists];

  if (value === 'name') {
    sorted.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
  } else if (value === 'likes') {
    sorted.sort((a, b) => b.likes - a.likes);
  } else if (value === 'date') {
    sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }

  renderPlaylists(sorted);
});
