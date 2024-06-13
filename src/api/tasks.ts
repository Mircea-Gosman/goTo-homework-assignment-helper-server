import express from 'express';
import { tasks } from '../logic/tasks';
import { Response } from "express"
import ErrorResponse from '../interfaces/responses/ErrorResponse.js';
import { TaskEntity } from '../interfaces/Task';
import { InsertOneResult } from 'mongodb';

const router = express.Router();

const _format_response = (res: Response, ans: any) => {
    if (ans.error) {
        res.status(ans.error.status || 500).send({ error: ans.error.message });
    } else {
        res.json(ans);
    }
}

router.get('/user', async (req, res) => {
    const filters: { [key: string]: string } = {}

    if (!req.user!.isAdmin) {
        filters['creatorId'] = req.user!._id
    }

    const ans: TaskEntity[] | ErrorResponse = await tasks.get(filters) 
    
    _format_response(res, ans);
});

router.post('/', async (req, res) => {
    const ans: TaskEntity | ErrorResponse = await tasks.createOne(req.user!._id);
    _format_response(res, ans);
});

router.patch('/', async (req, res) => {
    let ans: TaskEntity | ErrorResponse;
    const allowedStatusUpdates = [0, 1] 

    if (!req.body || (!req.body.task) || !req.body.task._id || (req.body.task.status && !allowedStatusUpdates.includes(req.body.task.status))) {
        ans = { status: 406, error: 'Invalid request body for task update.' } 
    } else {
        ans = await tasks.updateOne(req.body.task._id, req.body.task, req.user);
    }    
    
    _format_response(res, ans);
});

router.delete('/', async (req, res) => {
    let ans: {} | ErrorResponse = {}

    if (!req.body.taskId) {        
        ans = { status: 406, error: 'Missing TaskId for task deletion.' } 
    } else {
        ans = await tasks.deleteOne(req.body.taskId as string, req.user)
    }
    
    _format_response(res, ans);
});

export default router;