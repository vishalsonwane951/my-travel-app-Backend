import { International,International2 } from "../Models/InternationalModel.js";

export const getAllInternational = async (req, res) => {
    try{
        const cards = await International.find();
        if(!cards.length) return res.status(404).json({ message: 'No data found' });
        res.status(200).json(cards);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
};

export const createInternational = async(req,res)=>{
    try{
        const data = (req.body)
        if(!Array.isArray(data) || data.length === 0 )
            res.status(404).json({message:'No such data found',detals:err.message})
        const result = await International.insertMany(data);
            res.status(201).json({ message: 'Data inserted successfully', data: result });

    } catch(err){
        res.status(500).json({error:'server error',detals:err.message})
    }
}

export const getAllInternational2 = async (req, res) => {
    try{
        const cards = await International2.find();
        if(!cards.length) return res.status(404).json({ message: 'No data found' });
        res.status(200).json(cards);
        res.json(cards);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch Data'})
    }  
};

export const createInternational2 = async(req,res)=>{
    try{
        const data = (req.body)
        if(!Array.isArray(data) || data.length === 0 )
            res.status(404).json({message:'No such data found',detals:err.message})
        const result = await International2.insertMany(data);
            res.status(201).json({ message: 'Data inserted successfully', data: result });

    } catch(err){
        res.status(500).json({error:'server error',detals:err.message})
    }
}