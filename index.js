const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cors = require('cors');
const game = require('./routers/game');

const app = express();

app
    .use(cors())
    .use(express.json())

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use('/guessing-game', game);

app.use(express.static(path.join(__dirname, 'public')));



app.listen(PORT, () => console.log(`Listening on ${PORT}`));
