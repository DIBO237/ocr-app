

const express = require('express')

const bodyParser = require('body-parser')
const multer = require('multer');
//CREATE EXPRESS APP
const app = express();
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
//const storage = multer.memoryStorage()
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

var upload = multer({ storage: storage })
const pdf = require('pdf-parse');
 let datas;

// let dataBuffer = fs.readFileSync('test.pdf');

// pdf(dataBuffer).then(function(data) {

//     // number of pages
//     console.log(data.numpages);
//     // number of rendered pages
//     console.log(data.numrender);
//     // PDF info
//     console.log(data.info);
//     // PDF metadata
//     console.log(data.metadata); 
//     // PDF.js version
//     // check https://mozilla.github.io/pdf.js/getting_started/
//     console.log(data.version);
//     // PDF text
//     datas= data.text;

// });

app.get('/', function (req, res) {
    res.render('upload')
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    } else {

        let dataBuffer = fs.readFileSync('./uploads/'+file.originalname);

        pdf(dataBuffer).then(function(data) {

            // number of pages
            console.log(data.numpages);
            // number of rendered pages
            console.log(data.numrender);
            // PDF info
            console.log(data.info);
            // PDF metadata
            console.log(data.metadata); 
            // PDF.js version
            // check https://mozilla.github.io/pdf.js/getting_started/
            console.log(data.version);
            //console.log(data.text);
            // PDF text
            //console.log(data.text);
            if(data.metadata == null){
               res.send("<center><h1>PDF data cannot be pharsed !!</h1><br><a style='background-color: green; color:white;' href='/'>GO BACK</a></center>");
            }else{
                res.send('<p>'+data.text+'</p>');
            }

        });
       }

       
    

})



app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));