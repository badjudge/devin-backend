
import express from 'express';
import morgon from 'morgan';
import connect from './db/db.js';
import userRoutes from '../backend/routes/user.routes.js'
import cookieParser from 'cookie-parser';
import projectRoutes from './routes/project.routes.js';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js'


connect();
const app=express();


app.use(cors());
app.use(morgon('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use('/users',userRoutes);
app.use('/projects', projectRoutes);
app.use("/ai",aiRoutes);

app.get('/',(req,res)=> {
  res.send("hello");
});

module.exports = app;
