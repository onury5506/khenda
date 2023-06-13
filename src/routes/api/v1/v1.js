import { Router } from "express";
import videoAnalysis from './videoAnalysis.js'

const router = Router()

router.use("/video-analysis",videoAnalysis)

export default router