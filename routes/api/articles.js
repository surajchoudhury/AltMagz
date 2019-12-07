const express = require("express");
const router = express.Router();
const Article = require("../../models/article");
const auth = require("../../modules/auth");

//find articles globally

router.get("/", (req, res) => {
  Article.find({})
    .populate("author")
    .exec((err, article) => {
      if (err) return res.json({ err });
      if (!article)
        return res.json({ success: false, message: "No articles found!!" });
      res.json(article);
    });
});

// find single articles

router.get("/:slug", (req, res) => {
  let slug = req.params.slug;
  Article.find({ slug })
    .populate("author")
    .exec((err, article) => {
      if (err) return res.json({ err });
      if (!article)
        return res.json({ success: false, message: "Article not found!!" });
      res.json({ article });
    });
});

//find articles with categories

router.get("/category/:collection", (req, res) => {
  let collection = req.params.collection;
  Article.find({ category: collection })
    .populate("author")
    .exec((err, article) => {
      if (err) return res.json({ err });
      res.json({ article });
    });
});

////////////////////////////////// only logged user can access //////////////////////////////

router.use(auth.verifyToken);

//Create article

// let articleCollection = {
//   food: [],
//   travel: [],
//   programming: [],
//   motivation: []
// };

router.post("/", (req, res) => {
  Article.create(req.body, (err, article) => {
    if (err) return res.json({ err });
    if (!article)
      return res.json({ success: false, message: "Can't create article!!" });
    // if (article.category == "programming") {
    //   articleCollection.programming.push(article);
    // } else if (article.category == "food") {
    //   articleCollection.food.push(article);
    // } else if (article.category == "travel") {
    //   articleCollection.travel.push(article);
    // } else if (article.category == "motivation") {
    //   articleCollection.motivation.push(article);
    // } else {
    //   res.json({
    //     success: false,
    //     message: "please select a catagory before writing an article!!"
    //   });
    // }
    res.json({ success: true, message: "Succesfully created article!!" });
  });
});

// update an article

router.put("/:slug", (req, res) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, req.body, (err, articleToUpdate) => {
    if (err) return res.json({ err });

    if (!articleToUpdate)
      return res.json({
        success: false,
        message: "having trouble finding article!!"
      });
    res.json({
      success: true,
      message: "Succesfully updated!!",
      articleToUpdate
    });
  });
});


//delete an article

router.delete('/:slug',(req,res)=> {
  let slug = req.params.slug;
  Article.findOneAndDelete({slug},(err,response)=> {
    if(err) return res.json({err});
    if(!response) return res.json({success:false,message:"can't find article!"})
    res.json({success:true,message:"deleted succesfully"})
  })
})

// ////////////////////////////////// claps ////////////////////////////////////

router.post("/:slug/claps", (req, res) => {
  let slug = req.params.slug;
  Article.findOne({ slug }, (err, article) => {
    if (err) return res.json({ err });
    if (!article)
      return res.json({ success: false, message: '"Article not found' });
    Article.findOneAndUpdate({ slug: article.slug }, req.body, function(
      err,
      clap
    ) {
      if (err) return res.json({ err });
      if (!clap)
        return res.json({
          success: false,
          message: "Can not clap article not found!"
        });
      clap.claps++;
      res.json(clap);
    });
  });
});

module.exports = router;
