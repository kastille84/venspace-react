const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');


app.use(cors());
// Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());

// // REact build output folder
//app.use(express.static(path.join(__dirname +'/client/public/assets', 'assets'))); 

const apiRoutes = require('./server/routes/api.js');
app.use('/api', apiRoutes);

//# 
app.use(express.static(path.join(__dirname +'/client', 'build')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
//~#

const port = 5000;

app.listen(process.env.PORT || port, () => `Express Server is up and running.`);