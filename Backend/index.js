const express = require('express');
const multer = require("multer");
const cors = require("cors");
const path = require('path');


const app = express();
app.use(cors());

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if(!allowedTypes.includes(file.mimetype)){
        const error = new Error("incorrect file");
        error.code = "INCORRECT_FILETYPE";

        return cd(error, false)
    }
    cb(null, true);
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter,
    limits:{
        filedSize:500000
    }
});

const PORT = '5000' || process.env.PORT;

app.post('/upload', upload.single('file'), (req, res) =>{
    res.json({ file: req.file });
});

app.use((err, req, res, next) => {
if(err.code = "INCORRECT_FILETYPE"){
    res.status(422).json({ error: 'Only images are allowed' });
    return;
}
if(err.code = "LIMIT_FILE_SIZE"){
    res.status(422).json({ error: 'Allow file size is 599KB' });
    return;
}
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));