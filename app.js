const express = require("express");
const Song = require("./models/songs");
var cors = require('cors')
const jwt = require('jwt-simple')
const User = require("./models/users")

const app = express();
app.use(cors())

// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();
const secret = "supersecret"

router.post("/user", async(req,res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or password"})
   }

   const newUser = await new User({
      username: req.body.username,
      password: req.body.password,
      status: req.body.status

   })

   try{
      await newUser.save()
      console.log(newUser)
      res.sendStatus(201) //created
   }
   catch(err){
      res.status(400).send(err)
   }

})

router.post("/auth", async(req,res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or password"})
      return
   }

   let user = await User.findOne({username : req.body.username})
      
   if(!user){
         res.status(401).json({error : "Bad Username"})
      }
      else{
         if(user.password != rwq.body.password){
            res.status(401).json({error : "Bad Password"})
         }
         else{
            username2 = user.username
            const token = jwt.encode({username: user.username}, secret)
            const auth = 1

            res.json({
               username2, token: token, auth: auth
            })
         }
      }
   })

router.get("/status", async function(req, res) {

   // See if the X-Auth header is set
   if (!req.headers["x-auth"]) {
      return res.status(401).json(
         { error: "Missing X-Auth header" });
   }

   const token = req.headers["x-auth"];
   try {
      const decoded = jwt.decode(token, secret);

      let users = User.find({},"username status");
      res.json(users);
   }
   catch (ex) {
      res.status(401).json({ error: ex.message });}
});

// Get list of all songs in the database
router.get("/songs", async(req,res) =>{
   try{
      const songs = await Song.find({})
      res.send(songs)
      console.log(songs)
   }
   catch (err){
      console.log(err)
   }
})

//Grab a single song in the database
router.get("/songs/:id", async (req,res) =>{
   try{
      const song = await Song.findById(req.params.id)
      res.json(song)
   }
   catch (err){
      res.status(400).send(err)
   }
})

//added a song to the database
router.post("/songs", async(req,res) =>{
   try{
      const song = await new Song(req.body)
      await song.save()
      res.status(201).json(song)
      console.log(song)
   }
   catch(err){
      res.status(400).send(err)
   }
})

//update is to update an existing record/resource/database entry..it uses a put request
router.put("/songs/:id", async(req,res) =>{
   try{
      const song = req.body
      await Song.updateOne({_id: req.params.id},song)
      console.log(song)
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)
   }
})

router.delete("/songs/:id", async(req,res) =>{
   try{
      const song = await Song.findById(req.params.id)
      console.log(song)
      await Song.deleteOne({ _id: song._id })
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)
   }
})


app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});