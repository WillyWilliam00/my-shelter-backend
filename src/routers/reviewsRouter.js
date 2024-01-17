import express from "express"
import { Review } from "../models/reviews.js"
import { checkJwt } from "../middleware/jwtUtilits.js"
import { checkIfIsAuthorized } from "../Utilities.js/checkAuthorized.js"

const reviewsRouter = express.Router()

reviewsRouter

.get("/:shelterId",checkJwt,  async (req,res,next) => {
    try {
        const {shelterId} = req.params
        const reviews = await Review.find({shelterId: shelterId})
        .populate({
          path: 'createdBy',
          model: 'users', // Assicurati che sia il nome corretto del modello
          select: 'name surname' // Specifica i campi da popolare
      });
    
        // Ora il campo 'userId' conterrà sia 'name' che 'surname' dell'utente
        res.status(200).json(reviews);
      } catch (err) {
        next(err);
      }})

.post("/:shelterId", checkJwt, async (req, res, next) => {
  try{
    checkIfIsAuthorized(req.shelter)
            const createdBy = req.user.id
            const newReviewData = {...req.body, shelterId: req.params.shelterId, createdBy}
            const newReview = await Review.create(newReviewData)
            const populatedReview = await Review.findById(newReview._id)
            .populate({
                path: 'createdBy',
                model: 'users', // Assicurati che sia il nome corretto del modello
                select: 'name surname' // Specifica i campi da popolare
                
            });
     
    res.json(populatedReview)
  }catch (err) {
    next(err)
  }})
  
.put("/:id", checkJwt, async (req, res, next) => {
  try {
    checkIfIsAuthorized(req.shelter)
    const updateReview= await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true })
    res.json(updateReview)

  }catch (error) {
     next(error)
  }})

.delete("/:id", checkJwt, async (req, res, next) => {
  try {
    checkIfIsAuthorized(req.shelter)
    const deleteReview= await Review.findByIdAndDelete(req.params.id)
    res.status(!deleteReview ? 404 : 204).send()
  }catch (error) {
    next(error)
  }})
  
    

export default reviewsRouter