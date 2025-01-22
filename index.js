const express=require("express")
const mongodb=require("mongodb")
const bodyParser=require("body-parser")
const app=express()
app.listen(8080)
let db=null
mongodb.MongoClient.connect("mongodb://localhost:27017")
.then((conn)=>{
 db=conn.db("movieDb")
 console.log("database connected")
})
.catch(()=>{
console.log("failed to connect with databse")
})


const testMovies = [
    {
      name: "Harry Potter and the Order of the Phoenix",
      img: "https://bit.ly/2IcnSwz",
      summary: "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry.",
    },
    {
      name: "The Lord of the Rings: The Fellowship of the Ring",
      img: "https://bit.ly/2tC1Lcg",
      summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed.",
    },
    {
      name: "Avengers: Endgame",
      img: "https://bit.ly/2Pzczlb",
      summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.",
    },
  ];
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/movieSeed',async(req,res)=>{
    try {
       const movies=db.collection("movies")
       await movies.insertMany(testMovies)
        res.send("sample movie data inserted")
    } catch (error) {
        res.send("failed insertion sample data")
    }

})


app.get('/movie',(req,res)=>{
    const movie=db.collection("movies")
    movie.find().toArray()
   .then((movie)=>{
       res.status(200)
       res.json(movie)      
    })
    . catch ((error)=> {
        res.status(500)
        res.json({
            message:error.message
        })
    })
      
        
   

})

app.post('/movie',(req,res)=>{
    const movie=db.collection("movies")
    movie.insertOne(req.body)
    .then(()=>{
        res.status(200)
        res.json({
            message:"Movie Added"
        })
    })
    . catch ((error)=> {
        res.status(500)
        res.json({
            message:error.message
        })
    })
})

app.put('/movie/:id',async(req,res)=>{
    
        const movie=db.collection("movies")
        const id=req.params.id
        const body=req.body
         movie.updateOne({_id:new mongodb.ObjectId(id)},{$set:body})
         .then(()=>{

             res.status(200)
             res.json({
                 message:'movie updated'
             })
         })
        
    . catch ((error)=>{
        res.json({
            message:error.message
        })
    })
   
})
app.delete('/movie/:id',(req,res)=>{
    const movie=db.collection("movies")
    const id=req.params.id
    movie.deleteOne({_id:new mongodb.ObjectId(id)})
    .then(()=>{
        res.status(200)
        res.json({
            message:'movie deleted'
        })
})
.catch((error)=>{
    res.json({
        message:error.message
    })
})
})