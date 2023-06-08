// Get a reference to the Album option in the navbar
const albumOption = document.querySelector('a[href="#albums"]');

// Add a click event listener to the Album option
albumOption.addEventListener('click', fetchAlbums);

// Function to fetch and display albums
function fetchAlbums() {
  fetch('https://wutangdiscography.herokuapp.com/api/albums')
    .then(response => response.json())
    .then(data => {
      const albums = data;

      // Sort albums in alphabetical order based on the 'name' property
      albums.sort((a, b) => a.name.localeCompare(b.name));

      const contentContainer = document.getElementById('content');
      contentContainer.innerHTML = '';

      const albumList = document.createElement('ul');

      albums.forEach(album => {
        const listItem = document.createElement('li');
        listItem.textContent = album.name;

        // Add click event listener to each album list item
        listItem.addEventListener('click', () => {
          displayAlbum(album);
        });

        albumList.appendChild(listItem);
      });

      contentContainer.appendChild(albumList);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayAlbum(album) {
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';

  const albumTitle = document.createElement('h2');
  albumTitle.textContent = album.name;
  contentContainer.appendChild(albumTitle);

  const albumDetails = document.createElement('div');

  // Create and append album details
  const releaseDate = document.createElement('p');
  const releaseDateObj = new Date(album.release_date);
  const formattedReleaseDate = releaseDateObj.toLocaleDateString('en-US');
  releaseDate.textContent = 'Release Date: ' + formattedReleaseDate;
  albumDetails.appendChild(releaseDate);

  const totalTracks = document.createElement('p');
  totalTracks.textContent = 'Total Tracks: ' + album.total_tracks;
  albumDetails.appendChild(totalTracks);

  const trackList = document.createElement('ul');
  album.tracks.forEach(track => {
    const listItem = document.createElement('li');
    listItem.textContent = track;
    trackList.appendChild(listItem);
  });
  albumDetails.appendChild(trackList);

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete Album';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    deleteAlbum(album.name);
  });
  albumDetails.appendChild(deleteButton);

  // Create update button
  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update Album';
  updateButton.classList.add('update-button');
  updateButton.addEventListener('click', () => {
    displayUpdateForm(album);
  });
  albumDetails.appendChild(updateButton);

  contentContainer.appendChild(albumDetails);
}

function deleteAlbum(title) {
  fetch(`https://wutangdiscography.herokuapp.com/api/albums/${encodeURIComponent(title)}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        console.log('Album deleted successfully');
        fetchAlbums();
      } else {
        throw new Error('Request failed!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function createInputField(id, label, value) {
  const container = document.createElement('div');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = label;
  container.appendChild(inputLabel);

  const input = document.createElement('input');
  input.id = id;
  input.value = value;
  container.appendChild(input);

  return container;
}


function displayUpdateForm(album) {
  // clear existing content
  let albumDetails = document.getElementById('album-details');
  if (!albumDetails) {
    albumDetails = document.createElement('div');
    albumDetails.id = 'album-details';
    document.getElementById('content').appendChild(albumDetails);
  } else {
    albumDetails.innerHTML = '';
  }

  // create input fields for each album property
  const nameInput = createInputField('name', 'Name', album.name);
  const releaseDateInput = createInputField('release-date', 'Release Date', album.release_date);
  const totalTracksInput = createInputField('total-tracks', 'Total Tracks', album.total_tracks);
  
  // create save changes button
  const saveChangesButton = document.createElement('button');
  saveChangesButton.textContent = 'Save Changes';
  saveChangesButton.classList.add('update-button');
  saveChangesButton.addEventListener('click', () => {
    console.log('Save changes button clicked');
    const updatedAlbumData = {
      name: document.querySelector('#name').value,
      release_date: document.querySelector('#release-date').value,
      total_tracks: document.querySelector('#total-tracks').value
    };
    console.log(updatedAlbumData);
    updateAlbum(album.name, updatedAlbumData);
  });

  albumDetails.appendChild(nameInput);
  albumDetails.appendChild(releaseDateInput);
  albumDetails.appendChild(totalTracksInput);
  albumDetails.appendChild(saveChangesButton);
}




function updateAlbum(albumTitle, updateData) {
  fetch(`https://wutangdiscography.herokuapp.com/api/albums/${encodeURIComponent(album.name)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
})
  .then(response => {
    if (response.ok) {
      console.log('Album updated successfully');
      fetchAlbums();
    } else {
      throw new Error('Request failed!');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Song Lyrics Route

// Get a reference to the Lyrics option in the navbar
const lyricsOption = document.querySelector('a[href="#lyrics"]');

// Add a click event listener to the Lyrics option
lyricsOption.addEventListener('click', fetchSongs);

// Function to fetch and display songs
function fetchSongs() {
  fetch('https://wutangdiscography.herokuapp.com/api/songs')
    .then(response => response.json())
    .then(data => {
      const songs = data;

      // Sort songs in alphabetical order based on the 'title' property
      songs.sort((a, b) => a.title.localeCompare(b.title));

      const contentContainer = document.getElementById('content');
      contentContainer.innerHTML = '';

      const songList = document.createElement('ul');

      songs.forEach(song => {
        const listItem = document.createElement('li');
        listItem.textContent = song.title;

        // Add click event listener to each song list item
        listItem.addEventListener('click', () => {
          displaySongDetails(song);
        });

        songList.appendChild(listItem);
      });

      contentContainer.appendChild(songList);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displaySongDetails(song) {
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';

  const songTitle = document.createElement('h2');
  songTitle.textContent = song.title;
  contentContainer.appendChild(songTitle);

  const songDetails = document.createElement('div');
  songDetails.style.display = 'flex';
  songDetails.style.justifyContent = 'center';
  songDetails.style.alignItems = 'center';
  songDetails.style.height = '100%';


  // Fetch lyrics and append them to the song details
  fetch(`https://wutangdiscography.herokuapp.com/api/songs/${encodeURIComponent(song.title)}/lyrics`)
    .then(response => response.json())
    .then(data => {
      const lyrics = data.lyrics;
      const lyricsText = document.createElement('pre');
      lyricsText.textContent = lyrics;
      lyricsText.style.whiteSpace = 'pre-wrap';  
      lyricsText.style.fontFamily = 'monospace';
      lyricsText.style.marginTop = '1em';   
      songDetails.appendChild(lyricsText);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  contentContainer.appendChild(songDetails);
}


// Function to create input field container
function createInputField(id, label, value) {
  const container = document.createElement('div');

  const inputLabel = document.createElement('label');
  inputLabel.textContent = label;
  container.appendChild(inputLabel);

  const input = document.createElement('input');
  input.id = id;
  input.value = value;
  container.appendChild(input);

  return container;
}

function displayUpdateForm(song) {
  // clear existing content
  let songDetails = document.getElementById('song-details');
  if (!songDetails) {
    songDetails = document.createElement('div');
    songDetails.id = 'song-details';
    document.getElementById('content').appendChild(songDetails);
  } else {
    songDetails.innerHTML = '';
  }

  // create input fields for each song property
  const titleInput = createInputField('title', 'Title', song.title);
  const artistInput = createInputField('artist', 'Artist', song.artist);
  const durationInput = createInputField('duration', 'Duration', song.duration);

  // create save changes button
  const saveChangesButton = document.createElement('button');
  saveChangesButton.textContent = 'Save Changes';
  saveChangesButton.classList.add('update-button');
  saveChangesButton.addEventListener('click', () => {
    console.log('Save changes button clicked');
    const updatedSongData = {
      title: document.querySelector('#title').value,
      artist: document.querySelector('#artist').value,
      duration: document.querySelector('#duration').value
    };
    console.log(updatedSongData);
    updateSong(song.title, updatedSongData);
  });

  songDetails.appendChild(titleInput);
  songDetails.appendChild(artistInput);
  songDetails.appendChild(durationInput);
  songDetails.appendChild(saveChangesButton);
}

function updateSong(songTitle, updateData) {
  fetch(`https://wutangdiscography.herokuapp.com/api/songs/${encodeURIComponent(songTitle)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  })
    .then(response => {
      if (response.ok) {
        console.log('Song updated successfully');
        fetchSongs();
      } else {
        throw new Error('Request failed!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function deleteSong(title) {
  fetch(`https://wutangdiscography.herokuapp.com/api/songs/${encodeURIComponent(title)}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        console.log('Song deleted successfully');
        fetchSongs();
      } else {
        throw new Error('Request failed!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}