import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';


export const createProject = async ({
    name, userId
}) =>{
    if(!name){
        throw new Error('Project name is required');
    }
    if(!userId){
        throw new Error('User ID is required');
    }
    const project = await projectModel.create({
        name,
        users: [userId]
    })

    return project;
}

export const getAllProjectByUserId  = async ({userId}) => {
    if(!userId){
        throw new Error('User ID is required');
    }

    const allUserProjects = await projectModel.find({
        users: userId
    })

    return allUserProjects
}

export const addUsersToProject = async ({projectId, users, userId}) => {
if(!projectId){
        throw new Error('Project ID is required');
    }

    if(!userId){
        throw new Error('User ID is required');
    }

    if(!users){
        throw new Error('Users are required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid Project ID');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error('Invalid User IDs in the array');
    }

    const project = await projectModel.findOne({
        _id: projectId,
        users:userId
    })

    if(!project){
        throw new Error('Project not found or user is not part of the project');
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId},
        {
            $addToSet:{
                users:{
                    $each:users
                }
            }
        },{ new:true
    })

    return updatedProject
}

export const getProjectById = async({projectId})=>{
    if(!projectId){
        throw new Error('Project ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid Project ID');
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users');

    return project;
}

