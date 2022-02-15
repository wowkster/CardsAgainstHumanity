import { DB } from "../mongodb/database"
import { Model } from "../mongodb/mongo"

export interface IUser {
    discordId: string | null
    email: string
    username: string
    avatarUrl: string
    isAdmin: boolean
}

export class User extends Model<IUser> implements IUser {
    id!: string
    discordId!: string | null
    email!: string
    username!: string
    avatarUrl!: string
    isAdmin!: boolean

    async setEmail(email: string) {
        await DB.db.updateDocument('users', { id: this.id }, {
            $set: {
                email
            }
        })
    }

    async setPasswordHash(passwordHash: string) {
        await DB.db.updateDocument('users', { id: this.id }, {
            $set: {
                passwordHash
            }
        })
    }

    async setUsername(username: string) {
        await DB.db.updateDocument('users', { id: this.id }, {
            $set: {
                username
            }
        })
    }

    async setFields(fields: Partial<IUser>) {
        await DB.db.updateDocument('users', { id: this.id }, {
            $set: fields
        })
    }

    toJSON() {
        return {
            id: this.id,
            discordId: this.discordId,
            email: this.email,
            username: this.username,
            avatarUrl: this.avatarUrl,
            isAdmin: this.isAdmin,
        }
    }

    static UserFrom(u: IUser | null): User | null {
        if (!u) return null
        return Object.assign(new User(), u)
    }
}

export default User.UserFrom