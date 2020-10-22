const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const preAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const getMoreSongs = async url => {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
  const data = await response.json()

  insertSongsIntoPage(data)
}

const insertSongsIntoPage = songsInfo => {
  songsContainer.innerHTML = songsInfo.data.map(song => `
  <li class="song">
    <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">ver letra</button>
  </li>`).join('')

  if(songsInfo.prev || songsInfo.next) {
    preAndNextContainer.innerHTML = `
      ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ''}
      ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : ''}
    `
    return
  }

  preAndNextContainer.innerHTML = ''
}

const fetchSongs = async term => {
  const response = await fetch(`${apiURL}/suggest/${term}`)
  const data = await response.json()

  insertSongsIntoPage(data)
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const searchTerm = searchInput.value.trim()

  if(!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Digite um termo válido</li>`
    return
  }

  fetchSongs(searchTerm)
})

const fetchLyrics = async (artist, songTitle) => {
  const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
  const data = await response.json()
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
  console.log(lyrics)
  songsContainer.innerHTML = `
    <li>
      <h2><strong>${songTitle}</strong> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `
}

songsContainer.addEventListener('click', e => {
  const clickedElement = e.target

  if(clickedElement.tagName === 'BUTTON'){
    const artist = clickedElement.getAttribute('data-artist')
    const songTitle = clickedElement.getAttribute('data-song-title')

    preAndNextContainer.innerHTML = ''
    fetchLyrics(artist, songTitle)
  }
})