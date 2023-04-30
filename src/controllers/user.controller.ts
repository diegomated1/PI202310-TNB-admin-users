import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import questionsModel from "../models/questions.model.js";
import ui from 'uniqid';
import bc from 'bcrypt';

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const user = await userModel.findByPk(id_user, {
            attributes: {exclude: ['password']}
        });
        if (user) {
            res.status(200).json({ status: true, data: user });
        } else {
            res.status(404).json({ status: true, message: 'User not found' });
        }
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const modifyUsersById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const params = req.params;
        const body = req.body;
        const user = await userModel.findByPk(params.id_user);
        if (user == null) {
            res.status(404).json({ info: 'usuario no existe' })
        } else {
            await user.update({
                email: body.email,
                password : body.password,
                username : body.username,
            });
            res.status(200).json({status:true, info: 'Se actualizo el usuario con exito'})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({ status: false, info: 'no se actualizo el usuario' });
    }
    
}

const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const {ask, answer} = req.body;
        const user = await userModel.findByPk(id_user);
        if (!user) {
            return res.status(404).json({ status: true, message: 'User not found' });
        }

        await questionsModel.create({id_user, ask, answer});

        res.status(200).json({ status: true, message: 'Ask question' });
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
} 

const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        
        const questions = await questionsModel.findAll({
            where: { id_user },
            attributes: {
                exclude: ['answer']
            }
        });
        
        res.status(200).json({ status: true, data: questions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
} 

const checkQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user, id_question } = req.params;
        const { answer } = req.body;

        const user = await userModel.findByPk(id_user);
        if (!user) {
            return res.status(404).json({ status: true, message: 'User not found' });
        }

        const question = await questionsModel.findOne({
            where: { id_user, id_question }
        });

        if(question?.answer==answer){
            const new_password = ui();
            user.password = await bc.hash(new_password, 10);
            await user.save();
            res.status(200).json({ status: true, new_password });
        }else{
            res.status(200).json({ status: true, message: 'Invalid answer' });
        }


    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
} 

export default {
    getById,
    modifyUsersById,
    addQuestion, 
    getQuestions,
    checkQuestion
}