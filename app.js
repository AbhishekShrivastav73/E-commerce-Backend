const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();
require("dotenv").config();
const port = 3000;
const mongooseConnection = require("./config/mongoose");
const userRoutes = require('./routes/user.routes')
const indexRoutes = require('./routes/index.routes')
const productRoutes = require('./routes/products.routes')
const cookieParser = require('cookie-parser');


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzI4NzdjZTcyMzhlNTNiN2Y4NzMxOTEiLCJpYXQiOjE3MzA3MDUzNTksImV4cCI6MTczMDcwODk1OX0.UM-sd_RsCd9MYL5k0NI-zxW30qRms4S0K6lRzGS23AE
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(fileUpload())



app.use('/',indexRoutes)
app.use('/users',userRoutes)
app.use('/product', productRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${port}`);
});
