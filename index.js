// importing important libraries
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// importing routes
// const userRoutes = require('./src/User/user-routes')

const app = express();

// setting up localStrategy

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.session())
app.use(passport.initialize())
app.use(cors());
app.use(express.json());
// Serializing za user
passport.serializeUser((user, done) =>{
  done(null,user.username)
})

// deserializing za user
passport.deserializeUser((username, done) =>{
  if (username){
    done(null, user)
  }
  else{
    done(err, null)
  }
})

new LocalStrategy((username, password, done) => {
  if (err) {
    done(err, null);
  };
  if (user !== null) {
    done(null, user);
  }

});
passport.use(LocalStrategy)



// to make backend not empty for testing
app.get('/', (req, res) => {
  res.send("Working")
})

app.post('/login', passport.authenticate('local'),(req,res) =>{
  const {username,password} = req.body
  res.send({username,password})
})





app.listen(3000, () => {
  console.log(`Server has started at http://localhost:3000`);
});