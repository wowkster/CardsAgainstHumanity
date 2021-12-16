import createFastify from 'fastify'
import cors from 'fastify-cors'
import fastifyCookie, { FastifyCookieOptions } from 'fastify-cookie'
import fastifySocketIO from 'fastify-socket.io'
import router from './routes/index.js'

import { MONGO_CLIENT } from './util/mongo.js'
import authPlugin from './plugins/authPlugin.js'
import jsonReplyPlugin from './plugins/jsonReplyPlugin.js'

await MONGO_CLIENT.connect()

const fastify = createFastify({
    logger: {
        level: 'debug',
        prettyPrint:
            process.env.NODE_ENV === 'development'
                ? {
                      translateTime: 'HH:MM:ss Z',
                      ignore: 'pid,hostname',
                  }
                : false,
    },
    ignoreTrailingSlash: true,
    pluginTimeout: 20000,
    trustProxy: true,
})

fastify.register(cors)
fastify.register(authPlugin)
fastify.register(jsonReplyPlugin)

fastify.register(fastifyCookie, {
    secret: "this is my super poggers secret", // for cookies signature
    parseOptions: {}     // options for parsing cookies
  } as FastifyCookieOptions)

fastify.register(fastifySocketIO, {
    path: '/socket.io',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
})

fastify.register(router, {
    prefix: '/api/v1',
})

try {
    await fastify.listen(process.env.HTTP_PORT ?? 5000, '0.0.0.0')
} catch (err) {
    console.log('Error: ', err)
    process.exit(1)
}

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
