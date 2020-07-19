const express = require('express');
const path = require('path')
var bodyParser = require('body-parser')

const app = express()

const mongoose = require('mongoose')

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection;
//checking for db success
db.once('open', function(){
    console.log('connected to Mongodb')
})
// checking for db error
db.on('error', function(err){
    console.log('Error', err)
})

// bring in model
let Article = require('./models/articles')
 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
// add public static forlder 
app.use(express.static(path.join(__dirname,'public')))


app.get('/', (req,res) => {
    Article.find({}, function(err, articles) {
        if(err)  {
            console.log(err)
        } else {
           // console.log('articles from db', articles)
            res.render('index', {
                title: 'Articles',
                articles:articles 
            })
        }

    })
})

// get single article 

app.get('/article/:id', (req,res) => {
    Article.findById(req.params.id, (err, article)=> {
        res.render('article', {
            article:article
        })
    }) 
    
})
// router to add article page
app.get('/articles/add', (req,res)=> {
    res.render('add', {
        title: 'Add Articles'
    })
})
// add new article
app.post('/articles/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save((err)=> {
        if(err){
            console.log(err)
        } else {
            res.redirect('/')
        }
    })

})
// Load edit form
app.get('/article/edit/:id', (req,res) => {
    Article.findById(req.params.id, (err, article)=> {
        res.render('edit_article', {
            title:`Edit ${article.title}`,  
            article:article
        })
    }) 
    
})
//Edit Article
app.post('/article/edit/:id', (req, res)=>{
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body
    const query ={_id:req.params.id}
    
    Article.update(query, article, (err)=> {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
    
})
app.listen(port, () => console.log('Your app is listen on port', port))