const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 8000;


const checkserverWorking = (req,res) => {
   res.json({message:'server working',status :true});
}
app.get('/api/v1',checkserverWorking);

app.listen(port,()=>console.log('Server Running...'));