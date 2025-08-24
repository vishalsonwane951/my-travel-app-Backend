import express, { Router } from 'express';
import { getAllAgraPackageDeatails,createAllAgraPackageDeatails,
    getAllAndamanPackageDeatails,createAllAndamanPackageDeatails,
    getAllGoaPackageDeatails,createAllGoaPackageDeatails,
    getAllKashmirPackageDeatails,createAllKashmirPackageDeatails,
    getAllKerlaPackageDeatails,createAllKerlaPackageDeatails,
    getAllManaliPackageDeatails,createAllManaliPackageDeatails,
    getAllOotyPackageDeatails,createAllOotyPackageDeatails,
    getAllRajasthanPackageDeatails,createAllRajasthanPackageDeatails,
    getAllLadakhPackageDeatails,createAllLadakhPackageDeatails,
    getAllRishikeshPackageDeatails,createAllRishikeshPackageDeatails,
    getAllSikkimPackageDeatails,createAllSikkimPackageDeatails,
    getAllUdaipurPackageDeatails,createAllUdaipurPackageDeatails




} from '../controllers/PackageDetailsController.js';

const router = express.Router();


// Agra Routes
router.get('/getallpackagedetails',getAllAgraPackageDeatails),
router.post('create',createAllAgraPackageDeatails)

// Andman
router.get('/getallandamanpackagedetails',getAllAndamanPackageDeatails),
router.post('create',createAllAndamanPackageDeatails)

//Goa
router.get('/getallgoapackagedetails',getAllGoaPackageDeatails),
router.post('create',createAllGoaPackageDeatails)

// Kashmir      
router.get('/getallkashmirpackagedetails',getAllKashmirPackageDeatails),
router.post('create',createAllKashmirPackageDeatails)

// Kerla
router.get('/getallkerlapackagedetails',getAllKerlaPackageDeatails),
router.post('create',createAllKerlaPackageDeatails)

// Ladakh
router.get('/getallkerlapackagedetails',getAllLadakhPackageDeatails),
router.post('create',createAllLadakhPackageDeatails)

// Manali
router.get('/getallmanalipackagedetails',getAllManaliPackageDeatails),
router.post('create',createAllManaliPackageDeatails)

// Ooty
router.get('/getallootypackagedetails',getAllOotyPackageDeatails),
router.post('create',createAllOotyPackageDeatails)

// Rajasthan
router.get('/getallrajasthanpackagedetails',getAllRajasthanPackageDeatails),
router.post('create',createAllRajasthanPackageDeatails)

// Rishikesh
router.get('/getallrishikeshpackagedetails',getAllRishikeshPackageDeatails),
router.post('create',createAllRishikeshPackageDeatails)


// Sikkim
router.get('/getallsikkimpackagedetails',getAllSikkimPackageDeatails),
router.post('create',createAllSikkimPackageDeatails)

// Udaipur
router.get('/getalludaipurpackagedetails',getAllUdaipurPackageDeatails),
router.post('create',createAllUdaipurPackageDeatails)

export default router;