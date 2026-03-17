import mongoose from 'mongoose';

// Reusable schema fields
const baseCardFields = {
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  link: { type: String, required: true },
  images: { type: [String], required: true }
};

// Maharashtra Essential Cards Schema
const MaharashtraCardSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const MaharashtraCard = mongoose.model('MaharashtraCard', MaharashtraCardSchema);

// Maharashtra Traveller Choice Cards Schema
const MaharashtraTravellerChoiceSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const MaharashtraTravellerChoice = mongoose.model('MaharashtraTravellerChoice', MaharashtraTravellerChoiceSchema);

// Familly Freindly

const MaharashtraFamillyfreindllySchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const MaharashtraFamillyfreindlly = mongoose.model('MaharashtraFamillyfreindlly', MaharashtraFamillyfreindllySchema);

// HiddenGames

const HiddenGamesSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const HiddenGames = mongoose.model('hiddengames', HiddenGamesSchema);

// Outdoors

const OutdoorsSchema = new mongoose.Schema(baseCardFields,{ timestamps:true});
const Outdoors = mongoose.model('outdoors',OutdoorsSchema)

// Arts & theatre
const ArtsTheatreSchema = new mongoose.Schema(baseCardFields,{ timestamps:true});
const ArtsTheatre = mongoose.model('ArtsTheatre',ArtsTheatreSchema)


// NightLife

const NightLifeSchema = new mongoose.Schema(baseCardFields,{ timestamps:true});
const MaharashtraNightLife = mongoose.model('MaharashtraNightLife',NightLifeSchema)

//Museums
const MuseumsSchema = new mongoose.Schema(baseCardFields,{ timestamps:true});
const MaharashtraMuseums = mongoose.model('MaharashtraMuseums',MuseumsSchema)

export { MaharashtraCard, MaharashtraTravellerChoice, HiddenGames, Outdoors,ArtsTheatre,MaharashtraNightLife,MaharashtraFamillyfreindlly, MaharashtraMuseums};


