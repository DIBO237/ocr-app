
const express = require('express');
const app = express()
const fs = require('fs');
var bodyParser = require('body-parser');
let urls = "";
var data="hello";

async function quickstart(res) {
    const vision = require('@google-cloud/vision');
  
    const client = new vision.ImageAnnotatorClient({
        keyFilename:"sky.json",
    });
  
    const request = {
      "requests": [
        {
          "image": {
            "source": {
              "imageUri": urls,
            }
          },
          "features": [
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ],
        }
      ]
    };
  
    const [result] = await client.batchAnnotateImages(request);
    const detections = result.responses[0].fullTextAnnotation;
    data = detections.text;
    console.log(detections.text);
     
    app.get('/response', function(req,res){
         res.send(data)
    })

    res.redirect('/response')
  }
  

app.use(bodyParser.urlencoded())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));



app.get('/', function(req,res){
    res.render('index')
})

app.post('/', function(req,res){
    urls = req.body.urls;
    quickstart(res).catch(console.error);
  
    //res.redirect('/response')
    
})







app.listen(process.env.PORT || 3000,
  () => console.log("Server is running..."));