import { error } from 'console';
import {Agra,Andaman,Goa,Kashmir,Kerla,Ladakh,Manali,Ooty,Rahsthan,Rishikesh,Sikkim,Udaipur} from '../Models/PackageDetails.js';

export const getAllAgraPackageDeatails = async(req,res)=>{
    try{
        const cards = await Agra.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}

export const createAllAgraPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Agra.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

// Andaman
export const getAllAndamanPackageDeatails = async(req,res)=>{
    try{
        const cards = await Andaman.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllAndamanPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Andaman.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

// Goa    
export const getAllGoaPackageDeatails = async(req,res)=>{
    try{
        const cards = await Goa.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllGoaPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Goa.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

// Kashmir
export const getAllKashmirPackageDeatails = async(req,res)=>{
    try{
        const cards = await Kashmir.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllKashmirPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Kashmir.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

// Kerla  
export const getAllKerlaPackageDeatails = async(req,res)=>{
    try{
        const cards = await Kerla.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllKerlaPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Kerla.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

// Ladakh  
export const getAllLadakhPackageDeatails = async(req,res)=>{
    try{
        const cards = await Ladakh.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllLadakhPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Ladakh.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};
// Manali  
export const getAllManaliPackageDeatails = async(req,res)=>{
    try{
        const cards = await Manali.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllManaliPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Manali.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};

// Ooty  
export const getAllOotyPackageDeatails = async(req,res)=>{
    try{
        const cards = await Ooty.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllOotyPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Ooty.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};
// Rajasthan  
export const getAllRajasthanPackageDeatails = async(req,res)=>{
    try{
        const cards = await Rahsthan.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllRajasthanPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Rahsthan.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
};  

// Rishikesh
export const getAllRishikeshPackageDeatails = async(req,res)=>{
    try{
        const cards = await Rishikesh.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllRishikeshPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Rishikesh.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
}
  
  // Sikkim
export const getAllSikkimPackageDeatails = async(req,res)=>{
    try{
        const cards = await Sikkim.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllSikkimPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Sikkim.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
}

  // Udaipur
export const getAllUdaipurPackageDeatails = async(req,res)=>{
    try{
        const cards = await Udaipur.find();
        if(!cards.length) return res.status(404).json({message:'No Data Found'});
        res.json(cards);
    } catch (err){
        res.status(500).json({error: 'Fails to fetch data'})
    }
}


export const createAllUdaipurPackageDeatails = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await Udaipur.insertMany(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Failed to insert essential cards', details: err.message });
  }
}