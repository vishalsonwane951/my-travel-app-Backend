import mongoose from "mongoose";

const baseCardFields = {

    title:{type:String,required:true},
    duration:{type:String,required:true},
    location:{type:String,required:true},
    priceRange:{type:String,required:true},
    highlights:{type:String,required:true},
    itinerary:{type:String,required:true},
}

const AgraSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Agra = mongoose.model('Agra', AgraSchema);

// Andaman
const AndamanSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Andaman = mongoose.model('Andaman', AndamanSchema);

// Goa
const GoaSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Goa = mongoose.model('Goa', GoaSchema);

// Kashmir
const KashmirSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Kashmir = mongoose.model('Kashmir', KashmirSchema);

// Kerla
const KerlaSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Kerla = mongoose.model('Kerla', KerlaSchema);

// Ladakh
const LadakhSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Ladakh = mongoose.model('Ladakh', LadakhSchema);

// Manali
const ManaliSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Manali = mongoose.model('Manali', ManaliSchema);

// Ooty
const OotySchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Ooty = mongoose.model('Ooty', OotySchema);

// Rahsthan
const RahsthanSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Rahsthan = mongoose.model('Rahsthan', RahsthanSchema);

// Rishikesh
const RishikeshSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Rishikesh = mongoose.model('Rishikesh', RishikeshSchema);

// Sikkim
const SikkimSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Sikkim = mongoose.model('Sikkim', SikkimSchema);

// Udaipur
const UdaipurSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const Udaipur = mongoose.model('Udaipur', UdaipurSchema);

export {Agra,Andaman,Goa,Kashmir,Kerla,Sikkim,Ladakh,Manali,Ooty,Rahsthan,Rishikesh,Udaipur}