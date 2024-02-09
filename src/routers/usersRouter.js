import express from "express";
import { User } from "../models/user.js";
import { uploadImage, updateImage } from "../middleware/uploadImg.js" 
import bcrypt from "bcrypt"
import { checkJwt, generateToken } from "../middleware/jwtUtilits.js";
import { checkIfIsAuthorized } from "../Utilities.js/checkAuthorized.js"
import { Shelter } from "../models/shelters.js";
const usersRouter = express.Router()

usersRouter

.get("/", async (req, res, next) => { //ok
    try {
        res.status(200).json(await User.find({}).select("-password"))
    } catch (err) {
        next(err)
    }
    })

.get("/me", checkJwt, async (req, res, next) => { //ok
  try {
    const userId = req.user.id
    const myuser = await User.findById(userId).select("-password")
    if (!myuser) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(myuser);
  } catch (err) {
    next(err)
  }
})

.post("/", async (req, res, next) => { //ok
      try {
        const existingUser = await User.findOne({ mail: req.body.mail })
      const existingShelter = await Shelter.findOne({ "owner.mail": req.body.mail })
        if (existingUser || existingShelter) {
          return res.status(400).json({ message: "Questa mail esiste già!" })
        }
        const password = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({
          ...req.body,
          password,
        })
        const token = generateToken(newUser.id, "user");
        const { password: _, __v, ...newUserWithoutPassword } = newUser.toObject()
        res.status(201).json({ user: newUserWithoutPassword, token })
            } catch (err) {
        next(err)
      }
    })   


.patch("/me/image", checkJwt, uploadImage("user-img"), async (req, res, next) => { //ok
    try {
      checkIfIsAuthorized(req.user)
          if (req.file) {
            res.status(200).json(await updateImage(User, req.user.id, req.file.path))
          } else {
            res.status(400).json({ message: "No file uploaded" })
          }
        } catch (error) {
          next(error) // Passa eventuali errori al middleware di gestione degli errori
        }
      })

.get("/me/favorites", checkJwt, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const userWithFavorites = await User.findById(userId).populate({
        path: 'favoriteShelters',
        model: 'shelters', // Assicurati che sia il nome corretto del modello
        select: 'shelterName altitude image owner.firstName coordinates', // Specifica i campi da popolare
      })
      res.status(200).json(userWithFavorites.favoriteShelters);
    } catch (error) {
      next(error);
    }
  })

  .patch("/me/favorites/add", checkJwt, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { shelterId } = req.body; // Assicurati che il client invii l'ID del rifugio
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favoriteShelters: shelterId } },
        { new: true }).populate({
          path: 'favoriteShelters',
          model: 'shelters', // Assicurati che sia il nome corretto del modello
          select: 'shelterName altitude image owner.firstName coordinates', // Specifica i campi da popolare
        })
      res.status(200).json(updatedUser.favoriteShelters)

      if (!updatedUser) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
    } catch (error) {
      next(error);
    }
  })
  .patch("/me/favorites/remove", checkJwt, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { shelterId } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { favoriteShelters: shelterId } }, // $pull rimuove l'elemento dall'array
        { new: true }
      ).populate({
        path: 'favoriteShelters',
        model: 'shelters', // Assicurati che sia il nome corretto del modello
        select: 'shelterName altitude image owner.firstName coordinates', // Specifica i campi da popolare
      })
      res.status(200).json(updatedUser.favoriteShelters)
      if (!updatedUser) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

    } catch (error) {
      next(error);
    }
  })
  .patch("/me/favorites/clear", checkJwt, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { favoriteShelters: [] },
        { new: true }
      )
      res.status(200).json(updatedUser.favoriteShelters);
      if (!updatedUser) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
    } catch (error) {
      next(error);
    }
  });

export default usersRouter