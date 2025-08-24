import express from 'express';
import {getAllAgraPackages,createAgraPackage,
    getAllAndmanPackages,createAndmanPackage,
    getAllGoaPackages,createGoaPackage,
    getAllKashmirPackages,createKashmirPackage,getAllKeralaPackages,createKeralaPackage,
    getAllLadakhPackages,createLadakhPackage,getAllManaliPackages,createManaliPackage,
    getAllOotyPackages,createOotyPackage,getAllRajasthanPackages,createRajasthanPackage,
    getAllRishikeshPackages,createRishikeshPackage,getAllSikkimPackages,createSikkimPackage,
    getAllUdaipurPackages,createUdaipurPackage,
} from '../controllers/ExplorePackageController.js';

const router = express.Router();

router.get('/agra/getallpackage', getAllAgraPackages);
router.post('/agra/createPackage', createAgraPackage);

//AndmanRoute
router.get('/andman/getallpackage', getAllAndmanPackages);
router.post('/andman/createPackage', createAndmanPackage);

//GoaRoute
router.get('/goa/getallpackage', getAllGoaPackages);
router.post('/goa/createPackage', createGoaPackage);

//Kashmir Routes
router.get('/kashmir/getallpackage', getAllKashmirPackages);
router.post('/kashmir/createPackage', createKashmirPackage);

//Kerala Routes
router.get('/kerala/getallpackage', getAllKeralaPackages);
router.post('/kerala/createPackage', createKeralaPackage);

//Ladakh Routes
router.get('/ladakh/getallpackage', getAllLadakhPackages);
router.post('/ladakh/createPackage', createLadakhPackage);

//Manali Routes
router.get('/manali/getallpackage', getAllManaliPackages);
router.post('/manali/createPackage', createManaliPackage);


//Ooty Routes
router.get('/ooty/getallpackage', getAllOotyPackages);
router.post('/ooty/createPackage', createOotyPackage);

//Rajasthan Routes
router.get('/rajasthan/getallpackage', getAllRajasthanPackages);
router.post('/rajasthan/createPackage', createRajasthanPackage);

//Rishikesh Routes
router.get('/rishikesh/getallpackage', getAllRishikeshPackages);
router.post('/rishikesh/createPackage', createRishikeshPackage);

//Sikkim Routes
router.get('/sikkim/getallpackage', getAllSikkimPackages);
router.post('/sikkim/createPackage', createSikkimPackage);

//Udaipur Routes
router.get('/udaipur/getallpackage', getAllUdaipurPackages);
router.post('/udaipur/createPackage', createUdaipurPackage);

export default router;