const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const apiRoutes = require('./server/routes/api.js');
app.use('/api', apiRoutes);

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);