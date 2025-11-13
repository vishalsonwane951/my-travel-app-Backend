import {MaharashtraAnimation,MaharashtraState,MaharashtraState2} from '../Models/DomesticModel.js';

export const getallAnimation = async(req, res) => {
    try{
        const Animation = await MaharashtraAnimation.find();
        if(!Animation.length) return res.status(404).json({ message:'No data fouund'});
        res.json(Animation);
    }catch (err) {
        res.status(500).json({error: 'Failed to fetch Data', details:err.message})
    }

}

// export const createAnimation = async(req,res)=>{
//     try{
//         if(!Array.isArray(req.body)|| req.body.length === 0){
//             return res.status(400).json({error:'Request body must br non-empty array'});
//         }  
//         const result = await MaharashtraAnimation.insertMany(req.body);      
//         res.status(result);
//     } catch(err){
//         res.status(500).json({ error: 'Faild to insert Data'})
//     }
// };

export const createAnimation = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraAnimation.insertMany(req.body);
    res.status(201).json({ message: 'Data inserted successfully', data: result });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to insert data', 
      details: err.message 
    });
  }
};


// States
export const getAllStates = async (req, res) => {
  try {
    const states = await MaharashtraState.find();

    if (!states || states.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, data: states });
  } catch (err) {
    console.error("Error fetching states:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch states",
      details: err.message,
    });
  }
};

export const createStates = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }
    const result = await MaharashtraState.insertMany(req.body);
    res.json(result);

    res.status(200).json({ message: 'Stub: States would be inserted here.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert states', details: err.message });
  }
}


export const getAllStates2 = async (req, res) => {
  try {
    const state = await MaharashtraState2.find();
    if(!state.length) res.status(404).json({message:'No data found'});
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states', details: err.message });
  }
};


export const createStates2 = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Expected an array of states' });
    }

    const result = await MaharashtraState2.insertMany(data);

    return res.status(201).json({ message: 'Inserted successfully', insertedCount: result.length });
  } catch (error) {
    console.error('createStates2 error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
};


// export const createStates2 = async (req, res) => {
//   try {
//     if (!Array.isArray(req.body) || req.body.length === 0) {
//       return res.status(400).json({ error: 'Request body must be a non-empty array' });
//     }
//     const result = await MaharashtraState2.insertMany(req.body);
//     res.json(result);

//     res.status(200).json({ message: 'Stub: States would be inserted here.' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to insert states', details: err.message });
//   }
// }

