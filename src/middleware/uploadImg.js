import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Shelter } from "../models/shelters.js";
import { User } from "../models/user.js";


export const uploadImage = (folderName) => {
   
  return multer({
    
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `myshelter/${folderName}`,
      },
    }),
  }).single(folderName);
};


export const updateImage = async (Model, id, filePath) => {
    try {
      const updated = await Model.findByIdAndUpdate(id, { image: filePath }, { new: true }).select(Model===Shelter ? "-owner.password" : "-password");
      return updated;
    } catch (error) {
      next(error)
    }
  };
  

  