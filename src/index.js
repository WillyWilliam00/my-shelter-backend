import express from "express"
import mongoose from "mongoose"
import list from "express-list-endpoints"
import sheltersRouter from "./routers/sheltersRouter.js"
import reviewsRouter from "./routers/reviewsRouter.js";
import questionsRouter from "./routers/questionsRouter.js";
import genericErrorHandler from "./middleware/genericErrorHandler.js";
import usersRouter from "./routers/usersRouter.js";
import cors from "cors"



const server = express();


const whitelist = ["", "http://localhost:3030"]
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
server.use("/shelters", sheltersRouter)
server.use("/users", usersRouter)
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