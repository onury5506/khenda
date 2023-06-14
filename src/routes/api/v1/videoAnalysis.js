import { Router } from "express";
import multer from "multer";
import { addDataToQueue } from "../../../dataProcess/dataProcess.js";
import { videoStatuses } from "../../../db/tables/video.consts.js";
import knex from '../../../db/db.js'

const router = Router()

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ".json";
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const fileFilter = function (req, file, cb) {
    if (file.originalname.endsWith('.json')) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type!'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/", upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.sendStatus(400)
    }

    try {
        const id = await addDataToQueue(req.file.filename)

        res.send({
            id
        })
    } catch (e) {
        res.sendStatus(500)
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const video = await knex.select("status")
        .from("videos")
        .where({
            id
        }).first()

    if (!video) {
        return res.sendStatus(404)
    }
    
    if (video.status != 2) {
        return res.send({
            status: videoStatuses[video.status]
        })
    }

    const changes = await knex.select("uuid","stepName","startTime","endTime")
        .from("states")
        .where({
            video:id
        })

    res.send(changes)

})

export default router