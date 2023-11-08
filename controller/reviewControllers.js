const Review = require('../model/reviewModel')


//Add Review
const addReview = async (req, res) => {
    try {
    
      const data = {
        user:req.session.user_id,
        rating:req.body.rating,
        comment:req.body.comment,
      }

      await Review.findOneAndUpdate(
    
        { productId: req.body._id },
        { $push: { review: data }
        },
        { upsert: true, new: true }

    )
    
      res.json({added:true})

    } catch (error){
      console.log(error.message);
      res.render('500Error')
    }
  };


// to replay to a review
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
      res.render('500Error')
    }
};


//to like a review
const addLike = async (req, res) => {
  try {

    const reviewData = await Review.findOne({productId: req.body.productId,'review._id':req.body.reviewId, 'review.likes': req.session.user_id}).exec()

    if(reviewData){
       await Review.findOneAndUpdate(
    
      { productId: req.body.productId,'review._id':req.body.reviewId },
      {
        $pull: { 'review.$.likes': req.session.user_id }
      }
    )
    }else{
        await Review.findOneAndUpdate(
            
            { productId: req.body.productId,'review._id':req.body.reviewId },
            {
              $push: { 'review.$.likes': req.session.user_id }
            },
          )
    }
   
      res.json({added:true})

    } catch (error){
      console.log(error.message);
      res.render('500Error')
    }
};


module.exports ={
 addReview,
 addReplay,
 addLike,
  
}