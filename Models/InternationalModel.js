import mongoose from "mongoose";

const baseCardFields = {
    images:{type:String, required:true},
    title:{type:String,required:true}
}


const InternationalToursSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const International = mongoose.model('International',InternationalToursSchema);


const International2ToursSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const International2 = mongoose.model('International2',International2ToursSchema);

export {International,International2}