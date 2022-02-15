import { Db, Filter, FindOptions, MongoClient } from 'mongodb'


export interface MultiQueryOptions {
    limit?: number,
    skip?: number,
    sort?: boolean
}

export class MongoDB {
    private db!: Db
    private client!: MongoClient

    constructor(private dbName: string, private uri: string = 'mongodb://localhost:27017',) {

    }

    private async connect(): Promise<MongoClient> {
        this.client ??= new MongoClient(this.uri)

        await this.client.connect()

        this.db = this.client.db(this.dbName)

        return this.client
    }

    public async getDocuments<T>(collection: string, query: object = {}, options?: MultiQueryOptions): Promise<T[]> {
        await this.connect()

        options ??= {}
        options.limit ??= 0
        options.skip ??= 0
        options.sort ??= false

        const results = await this.db
            .collection(collection)
            .find(query, options.sort ? ({ score: { $meta: 'textScore' } } as FindOptions) : {})
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort ? { score: { $meta: 'textScore' } } : {})

        const arr = await results.toArray()

        for (let e of arr) delete (e as any)._id

        return arr as unknown as T[]
    }

    public async getDocument<T>(collection: string, query: object = {}): Promise<T | null> {
        await this.connect()

        const doc = await this.db.collection(collection).findOne(query)
        if (doc) delete (doc as any)._id
        return doc as unknown as T | null
    }

    public async insertDocument(collection:string, obj: object, options: object = {}) {
        await this.connect()

        await this.db.collection(collection).insertOne(obj, options)
    }

    public async updateDocument(collection:string, query: object, update: object) {
        await this.connect()

        await this.db.collection(collection).updateOne(query, update)
    }

}

export abstract class Model<T> {
    protected constructor() {}
}