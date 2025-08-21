import usermodel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import {validationResult} from 'express-validator';
//import { createUser } from '../services/user.service.js';
//const user = await createUser({ email, pass });
import redisClient from '../services/redis.service.js'
export const  createUserController = async(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({})
    }

    try{
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();

        res.status(201).send({user,token});


    }  catch (error){
        res.status(400).send(error.message);
    }
}

export const loginController = async (req,res)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {email,password} = req.body;

        const user = await usermodel.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                errors:'Invalid credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if(!isMatch){
            return res.status(401).json({
                errors:'Invalid credentials'
            })
        }

        const token = await user.generateJWT();

        res.status(200).json({user,token});

    }catch(err){
        res.status(400).send(err.message);
    }
} 

export const profileController = async (req,res)=>{

    console.log(req.user);

    res.status(200).json({
          user:req.user
    });
}
export const logoutController = async (req, res) => {
    try { const token = req.headers.authorization.split(' ')[1]||req.cookies.token;

        redisClient.set(token, 'logout', 'EX', 3600*24); // Set token in Redis with 1 day expiration        
        redisClient.status(200).json({
            message: 'Logged out successfully'
        });
    }catch (error) {
        res.status(500).json({
            error: 'An error occurred while logging out'
        });
}   }

export const getAllUsersController = async(req,res)=>{
   try{

    

    const loggedInUser = await usermodel.findOne({
        email:req.user.email
    })

    const allUsers = await userService.getAllUsers({userId:loggedInUser._id});
    res.status(200).json({
        allUsers
    });

   }catch(err){
      console.log(err);
      res.status(400).json({
          error:err.message
      });
   } 
}
