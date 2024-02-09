import { mongoose, Schema } from "mongoose"


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
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://images.pexels.com/photos/18447681/pexels-photo-18447681/free-photo-of-paesaggio-montagne-case-casa.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    availableServices: {
        accommodation: {
            type: Boolean, default: false
        },
        toilets: {
            type: Boolean, default: false
        },
        accessibility: {
            type: Boolean, default: false
        },
        animalsAllowed: {
            type: Boolean, default: false
        },
        wifi: {
            type: Boolean, default: false
        },
        guidedTours: {
            type: Boolean, default: false
        },
        picnicArea: {
            type: Boolean, default: false
        },
        parking: {
            type: Boolean, default: false
        }
    },    
    owner: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        mail: {
            type: String,
            required: [true, "L'indirizzo email è obbligatorio"],
        },
        phone: {
            type: String,
            required: [true, "Il numero di telefono è obbligatorio"]
        }
    }
});

export const Shelter = mongoose.model("shelters", ShelterSchema);
