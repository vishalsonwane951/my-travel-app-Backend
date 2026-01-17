import { error } from 'console';
import {AdventureTourPackage1,AdventureTourPackage2} from '../Models/PackagesModel.js';

export const getAllAdventurepackage1 = async(req,res)=>{
    try{
        const cards = await AdventureTourPackage1.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}

export const createAdventurepackage1 = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await AdventureTourPackage1.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};


export const getAllAdventurepackage2 = async(req,res)=>{
    try{
        const cards = await AdventureTourPackage2.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAdventurepackage2 = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await AdventureTourPackage2.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

