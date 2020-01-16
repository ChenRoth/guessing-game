const {Router} = require('express');

const router = Router();
const games = {};
const MAX = 100;
const MIN = 1;
let counter = 0;


router.get('/list', (req, res) => {
    res.send(Object.keys(games));
});

router.get('/:gameId', checkGame, (req, res) => {
    res.send(req.game);
});

router.post('/', (req, res) => {
   const game = createGame();
   games[game.id] = game;
   res.send(game);
});

router.post('/:gameId/player', checkGame, (req, res) => {
    const {name, guess} = req.body;

    if (!name) {
        return res.status(400).send('name is required');
    }
    if (!(isFinite(guess) && guess >= MIN && guess <= MAX)) {
        return res.status(400).send('guess must be a number between 1 and 100')
    }
    req.game.players.push({
        name,
        guess: Number(guess),
    });

    res.send({msg: 'participant has been added'});
});

router.post('/:gameId/start', checkGame, (req, res) => {
    if (req.game.players.length < 2) {
        return res.status(400).send('game must have at least 2 players');
    }
    if (req.game.isOver) {
        return res.status(400).send(`game ${req.game.id} is over!`);
    }

    req.game.result = roll();
    req.game.isOver = true;
    req.game.winner = decideWinner(req.game.players, req.game.result);

    res.send(req.game);
});


function decideWinner(players, result) {
    const distances = players.map((player, i) => {
        return {index: i, distance: Math.abs(result - player.guess)};
    });

    distances.sort((d1, d2) => {
        if (d1.distance < d2.distance) {
            return -1;
        }
        if (d1.distance > d2.distance) {
            return 1;
        }
        return 0;
    });

    return players[distances[0].index];
}

function roll() {
    return Math.floor(Math.random() * MAX) + MIN;
}

function checkGame(req, res, next) {
    const { gameId } = req.params;

    if (!games[gameId]) {
        return res.status(404).send(`game ${gameId} doesn't exist`);
    }
    req.game = games[gameId];
    next();
}

function createGame() {
    const id = ++counter;
    const game = {
        id,
        players: [],
        result: null,
        isOver: false
    }

    return game;
}


module.exports = router;
