import mongoose from 'mongoose';

// Define only the fields here (no options like timestamps here)
const baseCardFields = {
  code: { type: String, required: false, unique: true },  // package code/id
  duration: { type: String, required: false },
  highlights: [
    {
      icon: String,
      text: String
    }
  ],
  itinerary: [
    {
      day: String,
      activities: [String],
      icon: String
    }
  ],
  gallery: [
    {
      img: String,
      caption: String
    }
  ],
  testimonials: [
    {
      quote: String,
      author: String,
      rating: Number,
      avatar: String
    }
  ],
  pricing: [{
    original: String,
    discounted: String,
    currency: String
  }]
};

// Create separate schemas per location using baseCardFields and pass {timestamps: true} as option
const ExploreAgraSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreAgra = mongoose.model('ExploreAgra', ExploreAgraSchema);

const ExploreAndmanSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreAndman = mongoose.model('ExploreAndman', ExploreAndmanSchema);

 const ExploreGoaSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
 const ExploreGoa = mongoose.model('ExploreGoa', ExploreGoaSchema);

const ExploreKashmirSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreKashmir = mongoose.model('ExploreKashmir', ExploreKashmirSchema);

const ExploreKeralaSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreKerala = mongoose.model('ExploreKerala', ExploreKeralaSchema);

const ExploreLadakhSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreLadakh = mongoose.model('ExploreLadakh', ExploreLadakhSchema);

const ExploreManaliSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreManali = mongoose.model('ExploreManali', ExploreManaliSchema);

const ExploreOotySchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreOoty = mongoose.model('ExploreOoty', ExploreOotySchema);

const ExploreRajasthanSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreRajasthan = mongoose.model('ExploreRajasthan', ExploreRajasthanSchema);

const ExploreRishikeshSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreRishikesh = mongoose.model('ExploreRishikesh', ExploreRishikeshSchema);

const ExploreSikkimSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreSikkim = mongoose.model('ExploreSikkim', ExploreSikkimSchema);

const ExploreUdaipurSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const ExploreUdaipur = mongoose.model('ExploreUdaipur', ExploreUdaipurSchema);

export {
  ExploreAgra,
  ExploreAndman,
  ExploreGoa,
  ExploreKashmir,
  ExploreKerala,
  ExploreLadakh,
  ExploreManali,
  ExploreOoty,
  ExploreRajasthan,
  ExploreRishikesh,
  ExploreSikkim,
  ExploreUdaipur
};
