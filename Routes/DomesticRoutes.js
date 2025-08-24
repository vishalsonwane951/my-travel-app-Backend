// DomesticRoutes.js
import express from 'express';
import {getallAnimation,createAnimation,getAllStates,createStates,getAllStates2,createStates2} from '../Controllers/DomesticController.js';

const router = express.Router();

router.get('/getallanimation', getallAnimation);
router.post('/createanimation',createAnimation)

//  States

router.get('/getstates',getAllStates)
router.post('/createstates',createStates)

// States2
router.get('/getstates2',getAllStates2)
router.post('/createstates2',createStates2)
export default router;
