const express = require('express');
const path = require('path');
const fs = require('fs');
const artists = require('./data/artists');

const app = express();
const PORT = process.env.PORT || 3000;

const PICOCSS = 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css';

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('/', (req, res) => {
  const template = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

  const artistList = artists
    .map(
      (artist) => `
        <li class="artist-card">
          <a href="/artist/${artist.slug}">
            <img src="${artist.image}" alt="${artist.name}">
            <div class="artist-card-overlay">
              <h3>${artist.name}</h3>
              <p>${artist.hometown}</p>
            </div>
          </a>
        </li>`
    )
    .join('');

  res.send(template.replace('<!--List of Artists begins here-->', artistList));
});

app.get('/artist/:slug', (req, res) => {
  const artist = artists.find((a) => a.slug === req.params.slug);

  if (!artist) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${artist.name} - Top Hip Hop</title>
      <link rel="stylesheet" href="${PICOCSS}">
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <main class="container artist-page">
        <a href="/">&larr; Back to all artists</a>
        <h1>${artist.name}</h1>
        <img src="${artist.image}" alt="${artist.name}">
        <h2>Top Songs</h2>
        <ul>${artist.topSongs.map((song) => `<li>${song}</li>`).join('')}</ul>
        <h2>Top Albums</h2>
        <ul>${artist.topAlbums.map((album) => `<li>${album}</li>`).join('')}</ul>
      </main>
    </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
