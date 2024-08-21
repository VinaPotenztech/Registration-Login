const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const User = require('./models/model'); 
const authRoute=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes')
const passwordRoutes=require('./routes/passwordRoutes')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Form', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Serve homepage
app.get('/', (req, res) => {
  res.redirect('home.html');
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(__dirname + '/public/forgot-password.html');
});
app.use('/', passwordRoutes);


app.use('/', authRoute);
app.use('/', userRoutes);


const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
