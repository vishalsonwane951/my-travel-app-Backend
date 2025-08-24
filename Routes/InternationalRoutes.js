import express, { Router } from 'express'
import {getAllInternational,createInternational,
createInternational2,getAllInternational2
} from '../Controllers/InternationalController.js'


const router = express.Router()

router.get('/getallInternational',getAllInternational)
router.post('/createintrnational',createInternational)


router.get('/getallInternational2',getAllInternational2)
router.post('/createintrnational2',createInternational2)

export default router;