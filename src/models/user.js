import { mongoose, Schema } from "mongoose"

const UserSchema = new Schema({
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
    address: {
        type: String,
        required: true
    },
    houseNumber: {
        type: Number,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    favoriteShelters: [{
        type: Schema.Types.ObjectId,
        ref: 'shelters'
    }]
})

export const User = mongoose.model("users", UserSchema);