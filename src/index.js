import express from "express"
import mongoose from "mongoose"
import list from "express-list-endpoints"
import sheltersRouter from "./routers/sheltersRouter.js"
import reviewsRouter from "./routers/reviewsRouter.js";
import questionsRouter from "./routers/questionsRouter.js";
import genericErrorHandler from "./middleware/genericErrorHandler.js";
import usersRouter from "./routers/usersRouter.js";
import cors from "cors"
import { User } from "./models/user.js";
import { verifyPassword } from "./Utilities.js/verifyPassword.js";
import { generateToken } from "./middleware/jwtUtilits.js";
import { Shelter } from "./models/shelters.js";


const server = express()


const whitelist = ["https://myshelterapp.netlify.app", "http://localhost:3000" ]
const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      next(null, true)
    } else {
      next(new Error("Not allowed by CORS"))
    }
  },
  //credentials: true, //questo fa si che il token nell'URL venga passato al server
}
server.use(cors(corsOptions))
server.use(express.json())
server.post("/session", async (req, res, next) => {
  try {
    const { mail, password } = req.body;

    // Prima, tenta di autenticare come User
    let user = await User.findOne({ mail });

    if (user && await verifyPassword(password, user.password)) {
      // Se le credenziali dell'utente sono corrette
      const token = generateToken(user.id, "user");
      return res.status(200).json({ token });
    }

    // Se non è un User, tenta di autenticare come Shelter
    let shelter = await Shelter.findOne({ "owner.mail": mail });

    if (shelter && await verifyPassword(password, shelter.owner.password)) {
      // Se le credenziali del rifugio sono corrette
      const token = generateToken(shelter.id, "shelter");
      return res.status(200).json({ token });
    }

    // Se nessuna delle due autenticazioni ha successo
    return res.status(401).json({ message: "Invalid credentials" });

  } catch (err) {
    next(err);
  }
})
server.use("/shelter", sheltersRouter)
server.use("/user", usersRouter)
server.use("/reviews", reviewsRouter)
server.use("/questions", questionsRouter)





server.use(genericErrorHandler)

const port = process.env.PORT || 3030

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    server.listen(port, () => {
       console.log(`🚀 Server running on port ${port}`)
       console.table(list(server))
    })
})
.catch(() => {
    console.log("Errore nella connessione al DB 🙁")
})