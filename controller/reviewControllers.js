const Review = require('../model/reviewModel')


//Add Review
const addReview = async (req, res) => {
    try {
    
      const data = {
        user:req.session.user_id,
        rating:req.body.rating,
        comment:req.body.comment
      }

      await Review.findOneAndUpdate(
    
        { productId: req.body._id },
        {
          $push: { review: data }
        },
        { upsert: true, new: true }

    )
      res.json({added:true})

    } catch (error){
      console.log(error.message);
    }
  };

  const addReplay = async (req, res) => {
    try {
    
      const data = {
        user:req.session.user_id,
        comment:req.body.replyText
      }

      await Review.findOneAndUpdate(
    
        { productId: req.body.productId,'review._id':req.body.reviewId },
        {
          $push: { 'review.$.replay': data }
        },
        { upsert: true, new: true }

    )
      res.json({added:true})

    } catch (error){
      console.log(error.message);
    }
  };



module.exports ={
 addReview,
 addReplay,
  
}