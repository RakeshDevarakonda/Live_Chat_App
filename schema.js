
import mongoose from "mongoose";


const chatsschema= new mongoose.Schema({

    username:String,
    message:String,
    time:String,
    timestamp:{
        type: Date,
        default: Date.now 
    }
})


export const chatapp= mongoose.model('chatsschema',chatsschema)




