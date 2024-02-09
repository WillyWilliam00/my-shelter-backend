//passo alla funzione checkIfIsAuthorized  req.user o req.shelter all'occorrenza (estrapolati dal JwT)
//così facendo do la possibilità di utlizzare una determinata rotta solo se sei un profilo user o shelter 

//se la rotta possiede un ID nella URL aggiungi una verifica ulteriore, verifica se l'id di chi fa la chiamata (sempre presa dal JwT) sia lo stesso id
// del creatore della domanda o recensione (uniche rotte che dispongono di un ID nella URL e una chiamata tipo POST/PATCH/DELETE)

export const checkIfIsAuthorized = async (reqType, userId, questionOrReviewId, Model) => {
  if (!reqType) {              
      return false;
  } else if (questionOrReviewId && reqType === "user") {
      const questionOrReview = await Model.findById(questionOrReviewId);
      return questionOrReview && questionOrReview.createdBy.toString() === userId;
  }
  return true;
};


  //check se l'id proveniente dal check jwt sia lo stesso dell'id dell'utente della domanda che si vuole modificare (un utene puo modificare solo una sua domanda/recensione)

   
