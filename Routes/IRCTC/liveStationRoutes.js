import express from 'express';
import { fetchLiveStation } from '../../Controllers/IRCTC/Controller/liveStationController.js';


const router = express.Router();

router.get('/live-station', fetchLiveStation);

export default router;
