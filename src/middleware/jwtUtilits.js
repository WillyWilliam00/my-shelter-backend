import jwt from "jsonwebtoken"
import { User } from "../models/user.js"
import { Shelter } from "../models/shelters.js"



export const checkJwt = async (req, res, next) => {
    try {

      const token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
  
      if (payload.type === 'user') {
          req.user = await User.findById(payload.id);
          if (!req.user) {
            return res.status(404).json({ message: "User not found" });
          }
      } else if (payload.type === 'shelter' ) {
          req.shelter = await Shelter.findById(payload.id);

          if (!req.shelter) {
            return res.status(404).json({ message: "Shelter not found" });
          }
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  export const generateToken = (id, type) => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "1h" });
}



