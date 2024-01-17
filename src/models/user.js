import {mongoose, Schema } from "mongoose"

const UserSchema = new Schema ({
    name: {
        type: String,
        required: [true, "Il nome è obbligatorio"],
        
    },
    surname: {
        type: String,
        required: [true, "Il cognome è obbligatorio"],
        
    },
    mail: {
        type: String,
        required: [true, "La mail è obbligatoria"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La password è obbligatoria"],
    },
    image: {
        type: String
    },
    nationality: {
        type: String
    }
    // verificare se serve coordinate x mappa google

})

export const User = mongoose.model("users", UserSchema);