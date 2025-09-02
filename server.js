// 👇 More typical pattern
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import userModel from './models/user.model.js'; 
import {generateResult} from './services/ai.service.js'

//import mongoose from 'mongoose';
//mongoose.connect(process.env.MONGODB_URI);
//console.log("Mongo URI:", process.env.MONGODB_URI);

import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const port = process.env.PORT || 3000;


const server = http.createServer(app);

//const server = require('http').createServer();
const io =new Server(server,{
  cors:{
    origin:'*'
  }
});

io.use(async(socket, next)=>{
  try{

    const token = socket.handshake.auth?.token||socket.handshake.headers.authoriZation?.split('')[1];
    const projectId=socket.handshake.query.projectId;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid project ID'));
    }

    socket.project = await projectModel.findById(projectId);



    if(!token){
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if(!decoded){
    return next(new Error('Authentication error'));
  }
    socket.user=decoded;
    next();

  }catch(error){
     next(error)
  }
});


io.on('connection', socket => {
   socket.roomId = socket.project._id.toString();
  console.log('A user connected');

  
  socket.join(socket.roomId);

  socket.on('project-message',async data=>{
        
      const message=data.message;
   //console.log('message',data);
     const aiIsPresentInMessage = message.includes('@ai');
      
      if(aiIsPresentInMessage){
        const prompt = message.replace('@ai','');
        const result = await generateResult(prompt);
        io.to(socket.roomId).emit('project-message',{
          message:result,
          sender:{
            _id:'AI',
            email:'AI'
          }
        });

        return;
      }

      socket.broadcast.to(socket.roomId).emit('project-message',
        {
          message: data.message,
  sender: socket.user,
        }
      )
  })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => {
    console.log("user disconnected")
    socket.leave(socket.roomId)
  });
});
//server.listen(3000);


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

