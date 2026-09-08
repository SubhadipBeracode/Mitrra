import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        name:{
            type:String,
            required:true,
            trim:true,
        },
        type:{
            type:String,
            enum:['RSS','Topic'],
            required:true,
        },
        url:{
            type:String,
            default:null,//only important for RSS type
        },
    },
    {timestamps:true}
);
const Source = mongoose.model('Source',userSchema);
export default Source;