import express from 'express';
import session, { Session } from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import { OAuth2Client } from 'google-auth-library';
import { getDocument, insertOne, MONGO_CLIENT } from './mongo.js';
Session.prototype.destroyAsync = function () {
    const ctx = this;
    return new Promise((res, rej) => {
        ctx.destroy(err => {
            if (err)
                return rej(err);
            res(ctx);
        });
    });
};
await MONGO_CLIENT.connect();
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express();
const server = http.createServer(app);
const router = express.Router();
const io = new Server(server, {
    path: '/socket.io',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
});
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(express.json());
router.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload() ?? {};
    // If user is already in DB, jsut return the db stuff
    const existingUser = (await getDocument('users', { email }));
    if (existingUser) {
        return res.status(200).json({
            username: existingUser.username,
            email: existingUser.email,
            avatarUrl: existingUser.avatarUrl,
        });
    }
    // Insert User into DB
    if (!email)
        return res.status(400).send('Email was not recieved from provider');
    if (!name)
        return res.status(400).send('Username was not recieved from provider');
    if (!picture)
        return res.status(400).send('Avatar was not recieved from provider');
    const user = {
        email: email,
        username: name,
        avatarUrl: picture,
    };
    await insertOne('users', user);
    req.session.user = user;
    res.status(201).json(user);
});
router.delete("/auth/logout", async (req, res) => {
    await req.session.destroyAsync();
    res.status(200);
    res.json({
        message: "Logged out successfully"
    });
});
router.get("/@me", async (req, res) => {
    const { user } = req.session;
    if (!user)
        return res.status(401).send('Not logged in!');
    res.status(200);
    res.json(req.session.user);
});
app.use('/api/v1', router);
server.listen(process.env.HTTP_PORT, () => {
    console.log(`Server is live on http://localhost:${process.env.HTTP_PORT}`);
});
// router.get('/', async (req, res) => {
//     if (!req.session.user) return res.redirect('/login')
//     if (req.session.loggedin) {
//         res.redirect('/home')
//         res.end()
//     } else {
//         res.sendFile(path.join(0 + '/client/login.html'))
//     }
// })
// app.post('/auth', function (request, response) {
//     var username = request.body.username
//     var password = request.body.password
//     var signUp = request.body.signUp
//     if (signUp == '1') {
//         //Sign Up
//         var email = request.body.email
//         if (username && password && email) {
//             connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
//                 if (results.length > 0) {
//                     response.send('Email Already Taken')
//                     response.end()
//                 } else {
//                     connection.query(
//                         'SELECT * FROM users WHERE username = ?',
//                         [username],
//                         function (error, results, fields) {
//                             if (results.length > 0) {
//                                 response.send('Username Already Taken')
//                                 response.end()
//                             } else {
//                                 bcrypt.hash(password, 10, function (err, hash) {
//                                     // Store hash in database
//                                     connection.query(
//                                         'INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)',
//                                         [username, email, hash],
//                                         function (error, results, fields) {
//                                             if (error) {
//                                                 response.send(error)
//                                                 response.end()
//                                             } else {
//                                                 request.session.loggedin = true
//                                                 request.session.username = username
//                                                 response.redirect('/home')
//                                                 response.end()
//                                             }
//                                         }
//                                     )
//                                 })
//                             }
//                         }
//                     )
//                 }
//             })
//         } else {
//             response.send('<p>Please enter Username, Email, and Password!</p><a href="/">Go Back</a>')
//             response.end()
//         }
//     } else {
//         //login
//         if (username && password) {
//             connection.query(
//                 'SELECT password FROM users WHERE (username = ? OR email = ?) LIMIT 1',
//                 [username, username],
//                 function (error, results, fields) {
//                     if (error) {
//                         response.send(error)
//                         response.end()
//                     } else {
//                         if (results.length > 0) {
//                             bcrypt.compare(password, results[0].password, function (err, res) {
//                                 if (res) {
//                                     // Passwords match
//                                     // response.send('Logged In! Redirecting...');
//                                     request.session.loggedin = true
//                                     request.session.username = username
//                                     response.redirect('/home')
//                                     response.end()
//                                 } else {
//                                     // Passwords don't match
//                                     response.send('<p>Incorrect Username and/or Password!<p><a href="/">Go Back</a>')
//                                     response.end()
//                                 }
//                             })
//                         } else {
//                             //user doesn't exist
//                             response.send('<p>Incorrect Username and/or Password!<p><a href="/">Go Back</a>')
//                             response.end()
//                         }
//                     }
//                 }
//             )
//         } else {
//             response.send('<p>Please enter Username and Password!</p><a href="/">Go Back</a>')
//             response.end()
//         }
//     }
// })
// app.get('/home', function (request, response) {
//     if (request.session.loggedin) {
//         // 		response.send('Welcome back, ' + request.session.username + '!');
//         response.sendFile(__dirname + '/client/lobbies.html')
//     } else {
//         response.redirect('/')
//         response.end()
//     }
// })
// app.get('/room', function (request, response) {
//     if (request.session.loggedin) {
//         response.sendFile(__dirname + '/client/index.html')
//     } else {
//         response.redirect('/')
//         response.end()
//     }
// })
// app.get('/logout', function (request, response) {
//     if (request.session.loggedin) {
//         request.session.destroy()
//         response.redirect('/')
//         response.end()
//     } else {
//         response.redirect('/home')
//         response.end()
//     }
// })
// // GAME GAME GAME GAME GAME GAME GAME GAME GAME GAME GAME GAME GAME GAME
// var SOCKET_LIST = {}
// var lastWinner = 1
// var unusedCardNumbers = []
// var usedCardNumbers = []
// var blackId
// for (let i = 0; i < 285; i++) {
//     unusedCardNumbers.push(i)
// }
// blackId = unusedCardNumbers[Math.floor(Math.random() * 285)]
// var index = unusedCardNumbers.indexOf(blackId)
// if (index > -1) {
//     unusedCardNumbers.splice(index, 1)
//     usedCardNumbers.push(blackId)
// }
// var roundSubmittedCards = []
// // var io = require('socket.io').listen(serv);
// io.sockets.on('connection', function (socket) {
//     socket.id = Math.floor(10 * Math.random())
//     socket.name = ''
//     socket.wins = 0
//     socket.isCardCzar = false
//     var randomVals = []
//     for (let i = 0; i < 7; i++) {
//         randomVals.push(Math.floor(Math.random() * 1275))
//     }
//     socket.whiteCards = randomVals
//     SOCKET_LIST[socket.id] = socket
//     socket.emit('sendCard', {
//         responses: roundSubmittedCards,
//         blackCardId: blackId,
//     })
//     socket.on('winner', function (data) {
//         //find winner
//         var winnerId = data.winnerId
//         for (var i in SOCKET_LIST) {
//             var socket = SOCKET_LIST[i]
//             socket.emit('roundWinner', {
//                 cardId: data.cardId,
//                 playerId: winnerId,
//             })
//         }
//         lastWinner = winnerId
//         newRound()
//     })
//     socket.on('submitCard', function (data) {
//         // cardId
//         // playerId
//         var socket2 = SOCKET_LIST[data.playerId]
//         socket2.whiteCards.splice(socket2.whiteCards.indexOf(parseInt(data.cardId)), 1)
//         socket2.whiteCards.push(Math.floor(Math.random() * 1275))
//         SOCKET_LIST[data.playerId] = socket2
//         roundSubmittedCards.push({
//             cardId: data.cardId,
//             playerId: data.playerId,
//         })
//         for (var i in SOCKET_LIST) {
//             var socket = SOCKET_LIST[i]
//             socket.emit('sendCard', {
//                 responses: roundSubmittedCards,
//                 blackCardId: blackId,
//                 mycards: socket2.whiteCards,
//                 element: data.cardId,
//             })
//         }
//     })
//     socket.on('disconnect', function () {
//         delete SOCKET_LIST[socket.id]
//     })
// })
// setInterval(function () {
//     //send player's data every frame
//     for (var i in SOCKET_LIST) {
//         var socket = SOCKET_LIST[i]
//         let ol = Object.keys(SOCKET_LIST)
//         socket.emit('playerData', {
//             id: socket.id,
//             name: socket.name,
//             whiteCards: socket.whiteCards,
//             wins: socket.wins,
//             players: ol.length,
//             sockets: ol,
//         })
//     }
// }, 1000)
// // function addCard(socket){
// //     socket.whiteCards.push(Math.floor(Math.random() * 1275))
// // }
// // function removeOldCard(socket){
// // }
// function newRound() {
//     //choose card czar
//     var czarId = 1
//     roundSubmittedCards = []
//     // pick a black card of 285
//     blackId = unusedCardNumbers[Math.floor(Math.random() * 285)]
//     var index = unusedCardNumbers.indexOf(blackId)
//     if (index > -1) {
//         unusedCardNumbers.splice(index, 1)
//         usedCardNumbers.push(blackId)
//     }
//     for (var i in SOCKET_LIST) {
//         var socket = SOCKET_LIST[i]
//         socket.emit('newRound', {
//             cardCzarId: czarId,
//             blackCardId: blackId,
//             unused: unusedCardNumbers,
//             used: usedCardNumbers,
//             zoomMeetingCode: '256-357-924',
//             player1Data: {
//                 matchPoints: 40,
//                 previousWins: ['', '', '', ''],
//             },
//             player2Data: {
//                 matchPoints: 40,
//                 previousWins: ['', '', '', ''],
//             },
//             player3Data: {
//                 matchPoints: 40,
//                 previousWins: ['', '', '', ''],
//             },
//         })
//     }
// }
