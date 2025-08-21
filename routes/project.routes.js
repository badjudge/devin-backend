import { Router } from 'express';
import { body } from 'express-validator';
import project from '../models/project.model.js';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();


router.post('/create',
    authMiddleware.authuser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject


)

router.get('/all',
    authMiddleware.authuser,
    projectController.getAllProjects
)

router.put('/add-user',
    authMiddleware.authuser,
    body('projectId').isString().withMessage('Project ID must be a string'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)

router.get('/get-project/:projectId',
    authMiddleware.authuser,
    projectController.getProjectById
)

export default router;
