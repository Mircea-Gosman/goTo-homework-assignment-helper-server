import { ObjectId, OptionalId, InsertOneResult } from 'mongodb';
import { db } from '../database';
import { Status, TaskEntity } from '../interfaces/Task'
import { UserEntity } from '../interfaces/User';
import ErrorResponse from '../interfaces/responses/ErrorResponse';

const _validateTaskOwnership = async (taskID: string, user: UserEntity) : Promise<void> => {
    const oldTask = await db.collection<TaskEntity>('tasks').findOne({ _id: new ObjectId(taskID) })

    if (!oldTask || (oldTask.creatorId.toString() !== user._id.toString() && !user.isAdmin)) {
        throw new Error('Unauthorized task update.')
    }
}

const get = async (filters: { [key: string]: string }) : Promise<TaskEntity[] | ErrorResponse> => {
    try {
        return await db.collection<TaskEntity>('tasks').find(filters).toArray();
    } catch(e: any) {
        console.log('There was a problem accessing the DB to RETRIEVE the tasks.')
        return { error: e.message };
    }
}

const createOne = async (userId: ObjectId) : Promise<TaskEntity | ErrorResponse> => {    
    try {
        const endDate: Date = new Date();      // Set the date in the future so that the task appears as pending.
        endDate.setDate(endDate.getDate() + 7) // TODO: Ensure clock sync. (Although everything works in local.)

        const insertionResult: InsertOneResult<TaskEntity> = await db.collection<OptionalId<TaskEntity>>('tasks').insertOne({ 
            creatorId: userId, 
            title: 'A new task', 
            description: 'An empty description.', 
            endDate: endDate, 
            status: Status.Pending 
        });

        const createdTask: TaskEntity | null = await db.collection<TaskEntity>('tasks').findOne({ _id: insertionResult.insertedId })

        if (!createdTask) {
            throw Error('Could not insert Task.')
        }

        return createdTask
    } catch (e: any) {
        console.error('There was a problem accessing the DB to CREATE the task.');

        return { error: e.message };
    }

}

const updateOne = async (taskID: string, task: Partial<TaskEntity>, user: UserEntity) : Promise<TaskEntity | ErrorResponse> => {       
    let updatedTask: TaskEntity | null;
    
    try {
        await _validateTaskOwnership(taskID, user)
        delete task['_id']

        updatedTask = await db.collection<TaskEntity>('tasks').findOneAndUpdate(
            { _id: new ObjectId(taskID) },
            { $set: task },
            { returnDocument: 'after' }
        );

        if (!updatedTask) {
            throw Error('Could not find document to update.')
        }
    } catch (e: any) {
        console.error('There was a problem accessing the DB to UPDATE the task.');
        return { error: e.message };
    }

    return updatedTask;
}

const deleteOne = async (taskID: string, user: UserEntity) : Promise<{} | ErrorResponse> => {        
    try {
        await _validateTaskOwnership(taskID, user)
        await db.collection<TaskEntity>('tasks').deleteOne({ _id: new ObjectId(taskID) });
    } catch (e: any) {
        console.error('There was a problem accessing the DB to DELETE the task.');
        return { error: e.message };
    }

    return {};
}        

export const tasks = {
    get,
    createOne,
    updateOne,
    deleteOne
}