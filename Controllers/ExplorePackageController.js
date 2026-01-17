import {ExploreAgra,ExploreAndman,ExploreGoa,ExploreKashmir,ExploreKerala,
  ExploreLadakh,ExploreManali,ExploreOoty,ExploreRajasthan,ExploreRishikesh,
  ExploreSikkim,ExploreUdaipur
} from "../Models/ExplorePackageModel.js";

// f
export const getAllAgraPackages = async (req, res) => {
  try {
    const packages = await ExploreAgra.find();
    if (!packages.length) {
      return res.status(404).json({ message: 'No explore packages found' });
    }

    res.json({
      count: packages.length,
      data: packages
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch explore packages', 
      details: err.message 
    });
  }
};
``

    export const createAgraPackage = async (req, res)=>{
        try{
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({error: 'Request body must be a non-empty array'});
            }
            const result = await ExploreAgra.insertMany(req.body);
            res.status(201).json({ message: 'Packages created successfully', data: result });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
        }
    }







    //Andman


    
export const getAllAndmanPackages = async (req, res) => {
  try {
    const packages = await ExploreAndman.find();
    if (!packages.length) {
      return res.status(404).json({ message: 'No explore packages found' });
    }

    res.json({
      count: packages.length,
      data: packages
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch explore packages', 
      details: err.message 
    });
  }
};


    export const createAndmanPackage = async (req, res)=>{
        try{
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({error: 'Request body must be a non-empty array'});
            }
            const result = await ExploreAndman.insertMany(req.body);
            res.status(201).json({ message: 'Packages created successfully', data: result });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
        }
    }


    //Goa

export const getAllGoaPackages = async (req, res) => {
  try {
    const packages = await ExploreGoa.find();
    if (!packages.length) {
      return res.status(404).json({ message: 'No explore packages found' });
    }

    res.json({
      count: packages.length,
      data: packages
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch explore packages', 
      details: err.message 
    });
  }
};
``

    export const createGoaPackage = async (req, res)=>{
        try{
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({error: 'Request body must be a non-empty array'});
            }
            const result = await ExploreGoa.insertMany(req.body);
            res.status(201).json({ message: 'Packages created successfully', data: result });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
        }
    }

    
export const getAllKashmirPackages = async (req, res) => {
  try {
    const packages = await ExploreKashmir.find();
    if (!packages.length) {
      return res.status(404).json({ message: 'No explore packages found' });
    }

    res.json({
      count: packages.length,
      data: packages
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch explore packages', 
      details: err.message 
    });
  }
};
``

    export const createKashmirPackage = async (req, res)=>{
        try{
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({error: 'Request body must be a non-empty array'});
            }
            const result = await ExploreKashmir.insertMany(req.body);
            res.status(201).json({ message: 'Packages created successfully', data: result });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
        }
    }


    //Kerala

    export const getAllKeralaPackages = async (req, res) => {
      try {
        const packages = await ExploreKerala.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };


    export const createKeralaPackage = async (req, res)=>{
        try{
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({error: 'Request body must be a non-empty array'});
            }
            const result = await ExploreKerala.insertMany(req.body);
            res.status(201).json({ message: 'Packages created successfully', data: result });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
        }
    }


    //Ladakh

    export const getAllLadakhPackages = async (req, res) => {
      try {
        const packages = await ExploreLadakh.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };

    export const createLadakhPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreLadakh.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };


    //Manali

    export const getAllManaliPackages = async (req, res) => {
      try {
        const packages = await ExploreManali.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };

    export const createManaliPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreManali.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };


    //Ooty
    export const getAllOotyPackages = async (req, res) => {
      try {
        const packages = await ExploreOoty.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };

    export const createOotyPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreOoty.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };

    //Rajasthan

    export const getAllRajasthanPackages = async (req, res) => {
      try {
        const packages = await ExploreRajasthan.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };

    export const createRajasthanPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreRajasthan.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };


    //Rishikesh
    export const getAllRishikeshPackages = async (req, res) => {
      try {
        const packages = await ExploreRishikesh.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };

    export const createRishikeshPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreRishikesh.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };


    //Sikkim
    export const getAllSikkimPackages = async (req, res) => {
      try {
        const packages = await ExploreSikkim.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };

    export const createSikkimPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreSikkim.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };

    //Udaipur
    export const getAllUdaipurPackages = async (req, res) => {
      try {
        const packages = await ExploreUdaipur.find();
        if (!packages.length) {
          return res.status(404).json({ message: 'No explore packages found' });
        }

        res.json({
          count: packages.length,
          data: packages
        });
      } catch (err) {
        res.status(500).json({
          error: 'Failed to fetch explore packages',
          details: err.message
        });
      }
    };


    export const createUdaipurPackage = async (req, res) => {
      try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }
        const result = await ExploreUdaipur.insertMany(req.body);
        res.status(201).json({ message: 'Packages created successfully', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create explore packages', details: err.message });
      }
    };

