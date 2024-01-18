import express  from "express";
import { User } from "../models/user.js";
import {uploadImage, updateImage} from "../middleware/uploadImg.js" 
import bcrypt from "bcrypt"
import { checkJwt, generateToken } from "../middleware/jwtUtilits.js";
import { checkIfIsAuthorized } from "../Utilities.js/checkAuthorized.js"
import { verifyPassword } from "../Utilities.js/verifyPassword.js";
const usersRouter = express.Router()

usersRouter

.get("/", async (req,res,next) => { //ok
    try{
        res.status(200).json(await User.find({}).select("-password"))
    } catch (err) {
        next(err)
    }
    })

.get("/me", checkJwt, async (req,res,next) => { //ok
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
      try{
        const existingUser = await User.findOne({mail: req.body.mail})
        if(existingUser){
          return res.status(400).json({message: "Questa mail esiste già!"})
        }
        const password = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({
          ...req.body,
          password,
        })
        const token = generateToken(newUser.id, "user");
        const { password: _, __v, ...newUserWithoutPassword } = newUser.toObject()
        res.status(201).json({ user: newUserWithoutPassword, token })
      }catch (err) {
        next(err)
      }
    })
    .post("/session", async (req, res, next) => { //ok
      try {
        const { mail, password } = req.body
        const user = await User.findOne({ mail })
         
        if (!user || !await verifyPassword(password, user.password)) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        // Genera un nuovo token JWT
        const token = generateToken(user.id, "user");  
        // Restituisce l'utente con il nuovo token
        res.status(200).json({ token })
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

export default usersRouter