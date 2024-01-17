export const checkIfIsAuthorized = (reqType, next) => {
    if(reqType) {
     return res.status(401).json({ message: "Non sei autorizzato!" });
    }
    next()
  };