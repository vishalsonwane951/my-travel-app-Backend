import Favourite from "../Models/MyFavouritesModel";

export const addFavourites = async (req, res) => {
    try{
        const {PackageId,title,subtitle,image} =req.body;
        const userId = req.user.id;

        //avoid duplicate
        const existing = await Favourite.find({PackageId, user:userId});
        if(existing){
            return res.status(400).json({message:"Already added to favourites"})
        }
        
        const Fav = new Favourite({user:userId,PackageId,title,subtitle,image})
        await Fav.save()

        res.status(201).json({message: "Added Successfully"})

    } catch (err){
            res.status(500).json({message:"Server error",error: err.message})
    }
};

// Get All Faavourites

export const getAllFavourites = async (req,res)=>{
    try {
        const fav =await Favourite.find({ user: req.user.id});
        res.json(fav);
    } catch(err){
        res.status(400).json({message :"Server Error", error: err.message})
    }
}


// remove Favourite if You Hit Unlike 

export const removeFavourites = async (req,res)=>{
    try {
    const {PackageId} = req.body;
    const userId = req.user.id;

    const removefav = await Favourite.findByIdAndDelete({PackageId,user:userId})
    if(!removefav){
        res.status(400).json({message: "Favourite is Not found"})
    }
    res.json({message:"Removed Successfully"})
    } catch (err){
        rs.status(500).json({message:"Server Error", error: err.message})
    }
}
