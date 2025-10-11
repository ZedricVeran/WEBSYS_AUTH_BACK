// importing important libraries
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const app = express();
// Setting up global variable for user, dunno if it will work
let user = [{
  username: "user",
  password: "pass"
}]
// setting up middlewares
app.use(cors());
app.use(express.json());
// Initializing passport
// Establishing sessions in express
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
}))
// Establishing sessions in passport
app.use(passport.initialize())
app.use(passport.session())
// Serialization
passport.serializeUser((user, done) => {
  done(null, user.username)
})
// Deserialization
passport.deserializeUser((username, done)=>{
  const result = user.find((user) => user.username == username)
  if(result){
    done(null,result)
  }
  else{
    done(false,null)
  }
})
// Usage of the local strategy
app.post('/login', passport.authenticate('local'),(req,res) =>{
  res.send(user)
})
// Using localStrategy middleware
passport.use(new LocalStrategy((username, password, done) =>{
  // console.log(username)
  // console.log(password)
  const results = user.find((user) => user.username == username)
  // console.log(results)
  if(results != null) {
    done(null,results)
  }
  else{
    done(false,null)
  }

}))

// to make backend not empty for testing
app.get('/', (req, res) => {
  res.send("Working")
})

app.get('/users', (req, res) => {
  res.send(user)
})






app.listen(3000, () => {
  console.log(`Server has started at http://localhost:3000`);
});