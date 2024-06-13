import { db } from '../database';
import { ObjectId, OptionalId, InsertOneResult } from 'mongodb';
import { UserEntity } from '../interfaces/User';
import ErrorResponse from '../interfaces/responses/ErrorResponse';

const existsAccount = async (prompt: string, property: string) => {        
    let user: UserEntity | null;
    const query: { [key: string]: ObjectId | string } = {};
    query[property] = property === '_id' ? new ObjectId(prompt) : prompt;
    
    try {
        user = await db.collection<UserEntity>('users').findOne(query);
    } catch (e: any) {
        console.error('There was a problem accessing the DB to RETRIEVE the user.');
        return { error: e.message };
    }

    return user;
}

const createAccount = async (username: string): Promise<UserEntity | ErrorResponse> => {          
    try {
        const insertionResult: InsertOneResult<UserEntity> 
            = await db.collection<OptionalId<UserEntity>>('users').insertOne({ username: username, isAdmin: false });

        const createdUser: UserEntity | null = await db.collection<UserEntity>('users').findOne({ _id: insertionResult.insertedId })

        if (!createdUser) {
            throw Error('Could not insert User.')
        }

        return createdUser;
    } catch (e: any) {
        console.error('There was a problem accessing the DB to CREATE the user.');
        return { error: e.message };
    }
}

export const users = {
    existsAccount,
    createAccount
}