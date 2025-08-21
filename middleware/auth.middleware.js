import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';



export const authuser = async(req,res,next)=>{

    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
        //console.log(token);
        if(!token){
            return res.status(401).send({error:"Unauthorised user"});
        }
       const isBlacklisted = await redisClient.get(token);
       if(isBlacklisted) {
           return res.status(401).send({error:"unauthorised user"});
       }
//console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(decoded);
       req.user = decoded;
        next();
    }catch(error){
        //console.log(error);
        res.status(401).send({error:'unauthorised user'});
    }

} 



