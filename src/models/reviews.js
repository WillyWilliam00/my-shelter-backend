import {mongoose, Schema } from "mongoose"


const ReviewSchema = new Schema({

  shelterId: {
    type: Schema.Types.ObjectId,
    ref: 'shelters',
     
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Riferimento al modello degli utenti (se necessario)
        
      },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
       
    },
    date: {
      type: Date,
      default: Date.now,
    }
  });

  export const Review = mongoose.model("reviews", ReviewSchema);