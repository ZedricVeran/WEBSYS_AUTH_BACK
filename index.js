// importing important libraries
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const app = express();

// Setting up global variable for user, dunno if it will work
let user = [
  {
    id: 1,
    username: "admin",
    password: "pass",
    role: "admin"
  },
  {
    id: 2,
    username: "student",
    password: "pass",
    role: "student"
  }
]

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where files will be saved
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Create a unique filename (e.g., timestamp + original name)
    cb(null, file.originalname)
  }
});

const uploadToDisk = multer({ storage: storage });
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
  done(null, user.id)
})
// Deserialization
passport.deserializeUser((id, done) => {
  const result = user.find((user) => user.id == id)
  if (result) {
    done(null, result)
  }
  else {
    done(false, null)
  }
})
// Usage of the local strategy
app.post('/login', passport.authenticate('local'), (req, res) => {
  req.session.role = "admin"
  res.send(user)
})

app.post('/upload', uploadToDisk.single('filename'), (req, res) => {
  if(req.session.role == 'admin' || req.session.role == "student"){
    res.send("upload successfully")
  }
  else{
    res.send("error occured")
  }
})

// Using localStrategy middleware
passport.use(new LocalStrategy((username, password, done) => {
  // console.log(password)
  const results = user.find((user) => user.username == username && user.password == password)
  console.log(results)
  if (results != null) {
    done(null, results)
  }
  else {
    done(false, null)
  }

}))

// to make backend not empty for testing
app.get('/', (req, res) => {
  res.send("Working")
})

app.get('/users', (req, res) => {
  res.send(user)
})

// for DL
app.get('/download', (req, res) => {
  if (req.session.role == 'admin'){
    const fileName = req.query.filename
    const image = `${__dirname}/uploads/${fileName}`
    res.download(image)
  }
  else{
    res.send("error occured")
  }
})
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send("session destroyed")
  })
})






app.listen(3000, () => {
  console.log(`Server has started at http://localhost:3000`);
});