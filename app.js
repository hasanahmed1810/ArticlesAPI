const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

mongoose.connect("mongodb+srv://hasan:1234@cluster0.8r7py.mongodb.net/articlesDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
})

const Article = mongoose.model('Articles', articleSchema)

app.get('/articles', function(req, res) {
    Article.find(function(err, foundArticles){
        if(!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})

app.post('/articles', function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
    })

    newArticle.save()
})

app.delete('/articles', function(req, res){
    Article.deleteMany(function(err){
        if(err){
            res.send(err)
        }
    })
})

app.route('/articles/:articleTitle')

.get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        res.send(foundArticle)
    })
})

.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(err){
                res.send(err)
            }
        }
    )
})

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(err){
                res.send(err)
            }
        }
    )
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle}, 
        function(err){
            if(err){
                res.send(err)
            }
        }
    )
})

app.listen(3000, function () {
    console.log('server running')
})