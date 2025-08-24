import express from 'express';
import { getAllAdventurepackage1,createAdventurepackage1,
    createAdventurepackage2,getAllAdventurepackage2
} from '../controllers/PackagesController.js';

const router = express.Router();

// Adventure Tours card

router.get('/getalladventurepackage1',getAllAdventurepackage1);
router.post('/createpackage1',createAdventurepackage1)
router.get('/getalladventurepackage2',getAllAdventurepackage2);
router.post('/createpackage2',createAdventurepackage2)


// City Tours card
// router.get('/getallcitypackage1',getAllCitypackage1);
// router.post('/createpackage1',createCitypackage1)




export default router;