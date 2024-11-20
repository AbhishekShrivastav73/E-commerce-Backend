const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.error('MongoDB connection error:', err));


