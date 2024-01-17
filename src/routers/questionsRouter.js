import express from "express"
import { Question } from "../models/questions.js"
import { checkJwt } from "../middleware/jwtUtilits.js"
import { checkIfIsAuthorized } from "../Utilities.js/checkAuthorized.js"
const questionsRouter = express.Router()

questionsRouter

.get("/:shelterId", checkJwt, async (req,res,next) => { //restituisce tutte le domande di un rifugio particolare
    try {
        const {shelterId} = req.params
        const questions = await Question.find({shelterId: shelterId})
        .populate({
            path: 'createdBy',
            model: 'users', // Assicurati che sia il nome corretto del modello
            select: 'name surname' // Specifica i campi da popolare
        });
    
        // Ora il campo 'userId' conterrà sia 'name' che 'surname' dell'utente
        res.status(200).json(questions);
    } catch (err) {
        next(err)
    }})

.post("/:shelterId", checkJwt, async (req, res, next) => { //crea una domanda per un rifugio particolare

    try{
            const createdBy = req.user.id
            const newQuestionData = {...req.body, shelterId: req.params.shelterId, createdBy}
            const newQuestion = await Question.create(newQuestionData)
            const populatedQuestion = await Question.findById(newQuestion._id)
            .populate({
                path: 'createdBy',
                model: 'users', // Assicurati che sia il nome corretto del modello
                select: 'name surname' // Specifica i campi da popolare
                
            });

            res.json(populatedQuestion);
    }catch (err) {
      next(err)
    }})
    
.patch("/update-answer/:id", checkJwt, async (req, res, next) => { //aggiunge/modifica la risposta della domanda 
    try {
        
       
        checkIfIsAuthorized(req.user)
        const { answer } = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(
                req.params.id, 
                { answer: answer },
                { new: true }
            ).populate({
                path: 'shelterId',
                model: 'shelters', // Assicurati che sia il nome corretto del modello
                select: 'shelterName' // Specifica i campi da popolare
            });
            if (!updatedQuestion) {
                return res.status(404).send("Domanda non trovata");
            }
            res.status(200).json(updatedQuestion);
        } catch (error) {
            next(error);
        }
    })
    
.patch("/delete-answer/:id", checkJwt, async (req, res, next) => { // elimina la risposta e restituisce un campo vuoto 
    try {
        checkIfIsAuthorized(req.user)
        const { id } = req.params;
        const updatedQuestion = await Question.findByIdAndUpdate(
            id, 
            { answer: "" },
            { new: true }
            );
            if (!updatedQuestion) {
                return res.status(404).send("Domanda non trovata");
            }
            res.status(200).json(updatedQuestion);
        } catch (error) {
            next(error);
        }
    })


.patch("/update-question/:id", checkJwt, async (req, res, next) => { ///modifica la domanda  
            try {
               const { question } = req.body;
               const updatedQuestion = await Question.findByIdAndUpdate(
                        req.params.id, 
                        { question: question },
                        { new: true }
                    ).populate({
                        path: 'createdBy',
                        model: 'users', // Assicurati che sia il nome corretto del modello
                        select: 'name surname' // Specifica i campi da popolare
                        
                    });
                    if (!updatedQuestion) {
                        return res.status(404).send("Domanda non trovata");
                    }
                    res.status(200).json(updatedQuestion);
                } catch (error) {
                    next(error);
                }
            })
    
      
.delete("/:id", checkJwt, async (req, res, next) => { //elimina la domanda
    try {
      const deleteQuestion= await Question.findByIdAndDelete(req.params.id)
      res.status(!deleteQuestion ? 404 : 204).send()
    }catch (error) {
      next(error)
    }})
      

export default questionsRouter