const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get('/new',(req,res)=>{
    res.render('articles/new',{article: new Article()})
})

router.get('/edit/:id',async(req,res)=>{
    const article = await Article.findById(req.params.id) 
    res.render('articles/edit',{article: article})
})

router.get('/:_id',async (req,res)=>{
    console.log(req.params._id.trim())
    const article = await Article.findById(req.params._id.trim())
    if(article == null) res.redirect('/')
      res.render('articles/show',{ article: article})
})

router.post('/',async(req,res,next)=>{
    req.article = new Article()
    next()
},saveArticleAndRedirect('edit'))

router.put('/:id',async(req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('/'))


router.post('/delete/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


router.post('/',async(req,res)=>{
    let article = new Article({
        title:req.body.title,
        description:req.body.description,
        markdown:req.body.markdown
    })
    try{  
       article =  await article.save()
       res.redirect(`/articles/${article.id} `)
    }
    catch(e)
    {
        console.log(e)
        res.render('articles/new',{article:article})
    }
   
})


function saveArticleAndRedirect(path){
    
    return async(req,res)=>{
        let article = req.article 
            article.title=req.body.title
            article.description=req.body.description
            article.markdown=req.body.markdown
        try{  
           article =  await article.save()
           res.redirect(`/articles/${article.id} `)
        }
        catch(e)
        {
            res.render(`articles/${path}`,{article:article})
        }
    }
}

module.exports = router