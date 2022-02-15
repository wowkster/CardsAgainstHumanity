import { MongoDB } from "./mongo"
import UserFrom, { IUser } from "../models/User"
import cuid from 'cuid';

export class DB {
    public static db: MongoDB = new MongoDB('cards_against_humanity')

    public static async getUserFromDiscordID(discordId: string) {
        return UserFrom(await DB.db.getDocument('users', { discordId }))
    }

    public static async getUserFromID(id: string) {
        return UserFrom(await DB.db.getDocument('users', { id }))
    }

    public static async getUserFromEmail(email: string) {
        return UserFrom(await DB.db.getDocument('users', { email }))
    }

    public static async insertUser(newUser: IUser) {
        const id = cuid()
        
        await DB.db.insertDocument('users', {
            id,
            ...newUser
        })

        return id
    }
} 