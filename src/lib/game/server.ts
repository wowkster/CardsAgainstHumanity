import cuid from 'cuid'
import { config as load_env } from 'dotenv'
load_env()

import { FastifyInstance } from 'fastify'
import { Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { User } from '../models/User'

import { DB } from '../mongodb/database'

type Socket = SocketIOSocket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
type Server = SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

/**
 * Wrapper around socket to represent an Authenticated User Player
 */
export class Player {
    userId: string
    socket: Socket
    room: Room | null = null

    constructor(userId: string, socket: Socket) {
        this.userId = userId
        this.socket = socket
    }

    join(room: Room) {
        this.room = room
        room.addPlayer(this)
    }
}

export class Room {
    id: string // CUID
    owner: Player
    players: Set<Player> = new Set()
    expirationTimeout: NodeJS.Timer | null = null

    constructor(owner: Player) {
        this.id = cuid()
        this.owner = owner
    }

    removePlayer(player: Player) {
        this.players.delete(player)

        if (player !== this.owner) return

        // If the room owner leaves, delete the room after 5 minutes
        this.expirationTimeout = setInterval(() => {
            CAH.instance.deleteRoom(this)
        }, 1000 * 60 * 5)
    }

    addPlayer(player: Player) {
        player.socket.join(`game/room/${this.id}`)
        this.players.add(player)

        if (player !== this.owner) return

        // If the player that is joining is the owner (joined back) clear the expiration timeout
        clearTimeout(this.expirationTimeout!)
        this.expirationTimeout = null
    }
}

export class CAH {
    static instance: CAH

    io: Server
    rooms: Set<Room> = new Set()
    userIdToRoomMap: Map<string, Room> = new Map()
    userIdToSocketMap: Map<string, Socket> = new Map()

    constructor(fastify: FastifyInstance) {
        const { io } = fastify
        this.io = io

        io.use((socket, next) => {
            // Todo: Do Authentication
            next()
        }).on('connection', socket => {


            socket.on("disconnect", () => {

            })
        })
    }

    deleteRoom(roomToRemove: Room) {
        // Remove From Set
        this.rooms.delete(roomToRemove)

        // Use a for loop to not modify concurrently
        for (let [userId, room] of this.userIdToRoomMap.entries()) {
            if (room === roomToRemove) {
                // Tell the client to update the UI with an error
                this.userIdToSocketMap.get(userId)?.emit('game/room_deleted')
                // User is no longer in a room
                this.userIdToRoomMap.delete(userId)
            }
        }
    }
}