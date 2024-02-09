import express from "express"
import { Shelter } from "../models/shelters.js"
import { uploadImage, updateImage } from "../middleware/uploadImg.js" 
import bcrypt from "bcrypt"
import { checkJwt, generateToken } from "../middleware/jwtUtilits.js";
import { checkIfIsAuthorized } from "../Utilities.js/checkAuthorized.js"
import { User } from "../models/user.js";
const sheltersRouter = express.Router()



sheltersRouter

    .get("/", async (req, res, next) => { //ok
    try {
        res.status(200).json(await Shelter.find({}).select("-owner.password"))
    } catch (err) {
        next(err)
    }
    })

    .get("/me", checkJwt, async (req, res, next) => { //ok
      try {
        const shelterId = req.shelter.id
        const myshelter = await Shelter.findById(shelterId).select("-owner.password")
        if (!myshelter) {
          return res.status(404).json({ message: "Shelter not found" })
        }
        res.status(200).json(myshelter);
      } catch (err) {
        next(err)
      }
    })

    .get("/:id", async (req, res, next) => { //ok
        try {
          const { id } = req.params
          const shelter = await Shelter.findById(id).select("-owner.password")
          if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" })
          }
          res.status(200).json(shelter);
        } catch (err) {
          next(err)
        }
      })

    .post("/", async (req, res, next) => { //ok
      try {
        const existingShelter = await Shelter.findOne({ "owner.mail": req.body.owner.mail })
        const existingUser = await User.findOne({ mail: req.body.owner.mail })
        if (existingShelter || existingUser) {
          return res.status(400).json({ message: "Questo rifugio esiste già!" })
        }
        const password = await bcrypt.hash(req.body.owner["password"], 10)
        const newShelter = await Shelter.create({
          ...req.body,
          owner: {
            ...req.body.owner,
            password
          }
        })
        const token = generateToken(newShelter.id, "shelter");
        const newShelterWithoutPsw = newShelter.toObject() 
        delete newShelterWithoutPsw.owner.password;
        res.status(201).json({ shelter: newShelterWithoutPsw, token });
            } catch (err) {
        next(err)
      }
    })   

    

  .put("/me", checkJwt, async (req, res, next) => {
      try {
        checkIfIsAuthorized(req.shelter);
        const shelterId = req.shelter.id;
        const updateObject = { ...req.body };
      const existingShelter = await Shelter.findById(shelterId)
      updateObject.owner.password = existingShelter.owner.password
      // Aggiorna il rifugio nel database, escludendo la password dal processo di aggiornamento
      const updatedShelter = await Shelter.findByIdAndUpdate(
        shelterId,
        updateObject,
        { new: true }
      ); // Esclude la password dal documento restituito
      res.status(200).json(updatedShelter);
    } catch (error) {
      next(error);
    }
  })
    
  .delete('/me', checkJwt, async (req, res, next) => {
      try {
        checkIfIsAuthorized(req.shelter)
          const shelterId = req.shelter.id
          const deleteshelter = await Shelter.findByIdAndDelete(shelterId);
          res.status(!deleteshelter ? 404 : 204).send()
      } catch (err) {
          next(err);
      }
      
  })
  .patch("/me/image", checkJwt, uploadImage("shelter-img"), async (req, res, next) => { //ok
    try {
      checkIfIsAuthorized(req.shelter)
      if (req.file) {
        res.status(200).json(await updateImage(Shelter, req.shelter.id, req.file.path))
      } else {
        res.status(400).json({ message: "No file uploaded" })
      }
    } catch (error) {
      next(error) // Passa eventuali errori al middleware di gestione degli errori
    }
  })

export default sheltersRouter