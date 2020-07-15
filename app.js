const express = require("express"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require('method-override'),
	  app = express()

//V2

//app config
mongoose.connect('mongodb://localhost:27017/blogs', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'))

//mongoose models config
const blogSchema = new mongoose.Schema({
	titulo: String,
	imagen: String,
	cuerpo: String,
	fecha: {type: Date, default: Date.now}
})
const Blog = mongoose.model("Blog", blogSchema)


console.log(Date.now())
app.get("/", (req,res) => {
	res.redirect("/blogs")
});

app.get("/blogs", (req,res) => {
	//BUSCAR TODOS LOS BLOGS DE LA BD
	Blog.find({}, (error, blogsEncontrados) => {
		if(error) {
			console.log(error)
		} else {
			//RENDER INDEX.EJS
			res.render("index.ejs", {blogs: blogsEncontrados})
		}
	})	
})

app.get("/blogs/new", (req,res) => {
	//RENDER FORM
	res.render("new.ejs")
})

app.post("/blogs", (req,res) => {
	//AGARRAR LOS DATOS
	let nuevoBlog = req.body.blog
	//GUARDALOS BD
	Blog.create(nuevoBlog, (error, blogCreado) => {
		if(error) {
			console.log(error)
		} else {
			//REDIRECT A BLOG NUEVO
			let id = blogCreado._id
			res.redirect("/blogs/" + id)
		}
	})
	
})
		 
app.get("/blogs/:id", (req,res) => {
	//BUSCAR BLOGS ID
	Blog.findById(req.params.id, (error, blogEncontrado) => {
		if(error) {
			console.log(error)
		} else {
			//RENDER BLOG
			res.render("show", {blog: blogEncontrado})
		}
	})	
})

app.get("/blogs/:id/edit", (req,res) => {
	//BUSCAR BLOG PARA EDITAR
	Blog.findById(req.params.id, (error, blogEncontrado) => {
		if(error) {
			console.log(error)
		} else {
			//RENDER BLOG
			res.render("edit", {blog: blogEncontrado})
		}
	})	
})

app.put("/blogs/:id", (req,res) => {
	let blogCambiado = req.body.blog
	Blog.findByIdAndUpdate(req.params.id, blogCambiado, (error, blog) => {
		if(error) {
			console.log(error)
		} else {
			res.redirect("/blogs/" + req.params.id)
		}
	})
})

app.delete("/blogs/:id", (req,res) => {
	Blog.findByIdAndDelete(req.params.id, (error) => {
		if(error) {
			console.log(error)
		} else {
			console.log("BORRA2")
			res.redirect("/blogs")
		}
	})
})



app.listen("3000", () => {
	console.log("activo")
}) 