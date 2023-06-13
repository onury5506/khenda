import { Router } from "express";
import multer from "multer";

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

router.post("/", upload.single('file'), (req, res) => {
    /*
        TO-DO
        upload data
    */
})

router.get("/:id",(req,res)=>{
    const id = req.params.id
    /*
        TO-DO
        get video results
    */
})

export default router