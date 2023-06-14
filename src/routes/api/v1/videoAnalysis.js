import { Router } from "express";
import multer from "multer";
import { addDataToQueue } from "../../../dataProcess/dataProcess.js";

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
    if(!req.file){
        return res.sendStatus(400)
    }

    try{
        const id = await addDataToQueue(req.file.filename)

        res.send({
            id
        })
    }catch(e){
        res.sendStatus(500)
    }
})

router.get("/:id",(req,res)=>{
    const id = req.params.id
    /*
        TO-DO
        get video results
    */
})

export default router