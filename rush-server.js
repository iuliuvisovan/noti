var players = [];
module.exports = {
    init: (io) => {
        io.on('connection', socket => {
            players.push({
                id: socket.id,
                name: '<some unknown guy>',
                score: 0
            });
            io.emit('playerlistupdate', J(players));
            socket.on('playerUpdated', playerJson => {
                var player = JSON.parse(playerJson);
                var localPlayer = findPlayer(socket.id);
                localPlayer.name = player.name || '<some unknown guy>';
                localPlayer.score = player.score;
                socket.broadcast.emit('playerlistupdate', J(players));
            });
            socket.on('disconnect', playerJson => {
                players = players.filter(x => x.id != socket.id);
                io.emit('playerlistupdate', J(players));
                if (isGameStarted)
                    io.emit('interupt');
                isGameStarted = false;
            });
            socket.on('go', () => {
                if (isGameStarted)
                    return;
                initQuestions();
                socket.broadcast.emit('go');
                isGameStarted = true;
                io.emit('questionArrived', JSON.stringify({
                    question: questions[questions.length - 1],
                    currentPlayerScore: 0
                }));
            });
            socket.on('answerPush', response => {
                var currentPlayer = findPlayer(socket.id);
                // currentPlayer.score = currentPlayer.score + (response == eval(questions.pop()) ? 1 : 0);
                currentPlayer.score = currentPlayer.score + 1
                io.emit('playerlistupdate', J(players));
                if (currentPlayer.score > 4) {
                    io.emit('end', currentPlayer.name);
                    return;
                }
                socket.emit('questionArrived', JSON.stringify({
                    question: questions[questions.length - 1],
                    currentPlayerScore: currentPlayer.score
                }));
            });
        });
    },
}



var players = [];
var isGameStarted = false;
var findPlayer = (id) => players.find(x => x.id == id);
var J = (string) => JSON.stringify(string);

var questions = [];
var operators = ['+', '-'];
var initQuestions = () => {
    questions = [];
    for (var i = 0; i < 100; i++) {
        let x = i;
        let randomNumber1 = (new Date().getTime() + x % 23) % 99;
        let randomNumber2 = (new Date().getTime() + x % 16) % 99;
        let operator = operators[(new Date().getTime() + x % 9) % operators.length];
        questions.push(`${randomNumber1}${operator}${randomNumber2}`);
    }
}