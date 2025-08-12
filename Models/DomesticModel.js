import { MongoOIDCError } from "mongodb";
import mongoose, { Mongoose } from "mongoose";



const baseCardFields = {
    images:{ type:String, required:true },
    title:{type:String, required:true }

}

// Animation
const MaharashtraAnimationSchema = new mongoose.Schema(baseCardFields,{timestamps: true});
const MaharashtraAnimation = mongoose.model('MaharashtraAnimation',MaharashtraAnimationSchema);

// cardData
const MaharashtraStatesSchema = new mongoose.Schema(baseCardFields,{timestamps:true});
const MaharashtraState = mongoose.model('MaharashtraState',MaharashtraStatesSchema);

// states2
const MaharashtraStates2Schema = new mongoose.Schema(baseCardFields,{timestamps:true});
const MaharashtraState2 = mongoose.model('MaharashtraState2',MaharashtraStates2Schema);


export {MaharashtraAnimation,MaharashtraState,MaharashtraState2}



// Reusable schema fields
// const baseCardFields = {
//   title: { type: String, required: true },
//   subtitle: { type: String, required: true },
//   link: { type: String, required: true },
//   images: { type: [String], required: true }
// };

// // Maharashtra Essential Cards Schema
// const MaharashtraCardSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
// const MaharashtraCard = mongoose.model('MaharashtraCard', MaharashtraCardSchema);