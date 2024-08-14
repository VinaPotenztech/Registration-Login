
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/model'); 

const app = express();

app.use(bodyParser.json())
app.use(express.static('public'))

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/sign-up', async (req, res) => {
  try {
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country
    });

    const savedUser = await newUser.save();
    res.redirect('login.html')
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user', error });
  }
});


app.post('/login',async(req,res)=>{
   try {
      const user=await User.findOne({email:req.body.email});
      if(user){
         const result=req.body.password===user.password;
         if(result){
            res.send("Done...")
         }
         else{
            res.status(400).json({error:"password doesnt match"})
         }
      }
      else{
         res.json("user doent exists")
      }
   } catch (error) {
      res.json(error)
   }
})
app.get('/',(req,res)=>{
   res.redirect('index.html');
    
})

const PORT =  3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
