const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const User = require('./models/model'); 

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

// Sign-up route
app.post('/sign-up', async (req, res) => {
  try {
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country
    });

    await newUser.save();
    res.redirect('login.html');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && req.body.password === user.password) {
      res.cookie('userId', user._id.toString(), { httpOnly: true });
      res.redirect('/profile'); // Redirect to profile page
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Serve profile page
app.get('/profile', async (req, res) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send JSON data about the user
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update profile route
app.put('/update-profile', async (req, res) => {
  try {
    const { firstname,lastname,email, password, country } = req.body;
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { firstname,lastname,email, password, country }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

//change password
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

app.post('/change-password',async(req,res)=>{
  try {
    const {currentPassword,newPassword}=req.body;
    const userId=req.cookies.userId;


     // Validate new password
     if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long, include at least 1 letter, 1 number, and 1 special character.'
      });
    }

    if(!userId){
      return res.status(400)._construct({message:'User ID is required'});
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({message:'Invalid User ID format'});
    }

    const user=await User.findById(userId);
    if(!user || user.password !== currentPassword){
      return res.status(400).json({message:'Current password is incorrect'});
    }

    user.password=newPassword;

    await user.save();
    res.json({message:"Password updated successfully"});
  } catch (error) {
    console.error('Error updating password',error);
    res.status(500).json({message:'Error updating password',error:error.message});    
  }
})
// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('home.html');
});

const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
