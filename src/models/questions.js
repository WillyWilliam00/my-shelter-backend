import {mongoose, Schema } from "mongoose"
 

const QuestionSchema = new Schema ({

    shelterId: {
    type: Schema.Types.ObjectId,
    ref: 'shelters',
     
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Riferimento al modello degli utenti (se necessario)
         
      },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
    }

})

export const Question = mongoose.model("questions", QuestionSchema);