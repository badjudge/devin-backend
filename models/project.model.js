import mongoose from 'mongoose';
//import { Lowercase } from 'express-validator';


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
},
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            
        }
    ]
});

const project = mongoose.model('project', projectSchema);

export default project;