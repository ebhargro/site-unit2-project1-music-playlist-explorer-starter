
fetch('data/data.json')
  .then(res => res.json())
  .then(data => {
    const playlists = data.playlists;
    const random = Math.floor(Math.random() * playlists.length);
    const selected = playlists[random];
    renderFeaturedPlaylist(selected);
  });

function renderFeaturedPlaylist(playlist) {
  document.getElementById('featured-img').src = playlist.playlist_art;
  document.getElementById('featured-title').textContent = playlist.playlist_name;
  document.getElementById('featured-author').textContent = `by ${playlist.playlist_author}`;

  const songList = document.getElementById('featured-song-list');
  songList.innerHTML = playlist.songs.map(song => `
    <div class="song-card">
      <img class="song-img" src="${song.cover_art}" alt="Song Image" />
      <div class="song-details">
        <p class="song-title">${song.title}</p>
        <p class="song-meta">${song.artist} | ${song.album}</p>
      </div>
      <div class="song-time">${song.duration}</div>
    </div>
  `).join('');
}
