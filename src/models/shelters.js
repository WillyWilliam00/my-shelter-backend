import {mongoose, Schema } from "mongoose"


const ShelterSchema = new Schema({
    
    shelterName: {
        type: String,
        required: [true, "Il nome del rifugio è obbligatorio"]
    },
    altitude: {
        type: Number,
        required: [true, "L'altitudine del rifugio è obbligatoria"],
        min: [0, "L'altitudine deve essere un numero positivo o zero"],
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: [true, "La foto di sfondo è obbligatoria"],
    },
    availableServices: {
        accommodation: {
            type: { type: Boolean, default: false, required: true }
        },
        toilets: {
            type: { type: Boolean, default: false, required: true }
        },
        accessibility: {
            type: { type: Boolean, default: false, required: true }
        },
        dogsAllowed: {
            type: { type: Boolean, default: false, required: true }
        }
    },    
    owner: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        mail: {
            type: String,
            required: [true, "L'indirizzo email è obbligatorio"]
        },
        phone: {
            type: String,
            required: [true, "Il numero di telefono è obbligatorio"]
        }
    }
});

export const Shelter = mongoose.model("shelters", ShelterSchema);
