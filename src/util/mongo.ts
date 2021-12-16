import { MongoClient } from 'mongodb'
import {config} from 'dotenv'
config()

export const MONGO_CLIENT = new MongoClient(process.env.MONGO_URL ?? 'mongodb://localhost:27017')

function db() {
    return MONGO_CLIENT.db('cards_against_humanity')
}

export async function getDocuments(col: string, query = {}, limit = 0) {
    return db().collection(col).find(query).limit(limit);
}

export async function getDocument(col: string, query: object): Promise<object> {
    const doc = await db().collection(col).findOne(query) as any
    if (doc)
        delete doc?._id
    return doc
}

export async function upsertDocument(col: string, filter: object, update: object) {
    return db().collection(col).updateOne(filter, update, {
        upsert: true
    });
}

export async function updateDocument(col: string, filter: object, update: object) {
    return db().collection(col).updateOne(filter, update);
}

export async function insertMany(col: string, documents: object[]) {
    const options = { ordered: true };

    return await db().collection(col).insertMany(documents, options)
}

export async function insertOne(col: string, document: object) {
    return await db().collection(col).insertOne(document)
}

export async function deleteOne(col: string, query: object) {
    return await db().collection(col).deleteOne(query)
}