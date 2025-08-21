
import mongoose from 'mongoose';

console.log(process.env.MONGODB_URI)

function connect() {
    mongoose.connect(process.env.MoNGODB_URI)
    .then(()=> {
        console.log("connected to mongodb");
    })
    .catch(err=>{
        console.log(err);
    })
}

export default connect;