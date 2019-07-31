const express = require("express")
const bodyParser = require("body-parser")
const Users = require("./models/user")
const mongoose = require("mongoose")
const app = express()

app.use(bodyParser.json())

mongoose.connect("mongodb://soni3360:soni3360@ds157707.mlab.com:57707/userinter", ()=> console.log("mongoose connected"))

app.get("/", (req,res)=>{
	Users.find().then(users=>res.json(users)).catch(err=>res.status(404).json(err))
})

app.get("/:id", (req,res)=>{
	Users.findOne({_id:req.params.id}).exec().then(user=>{
		if(user==null){
			res.status(403).json({"error":"user not found"})
			return
		}
		res.json(user)}).catch(err=>res.status(404).json(err))
})

app.post("/api/post/user", (req,res) => {

	const user = new Users({
		name : req.body.name,
		email : req.body.email,
		bdate : req.body.bdate
	})

	user.save()
		.then((result)=> {
			res.json({"result":"user created", "data":result})
			console.log("did it")
		})
		.catch((err)=> {
			res.status(404).json(err)
		})

})

app.delete("/api/delete/user/:id",(req,res) => {
	Users.findOneAndRemove({_id: req.params.id})
		 .exec()
		 .then((result)=>{
		 	res.json({"result":"user deleted", "deletedUser":result})
		 })
		 .catch((err)=>{
		 	res.status(404).json(err)
		 })

})


app.put("/api/update/user/:id",(req,res)=> {
	Users.findOneAndUpdate({_id: req.params.id},

		 	req.body,
		 	{new:true}
		)
		 .exec()
		 .then((result)=>{
		 	res.json({"result":"user updated","updatedUser":result})
		 })
		 .catch((err)=>{
		 	res.status(404).json(err)
		 })
})

app.listen(5000, () => {
	console.log("server connected to port 5000")
})

