import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";


const getById = async (req:Request, res:Response, next: NextFunction)=>{
    try{
        const {id_user} = req.params;
        const user = await userModel.findByPk(id_user);
        if(user){
            res.status(200).json({status: true, data: user});
        }else{
            res.status(404).json({status: true, message: 'User not found'});
        }
    }catch(error){
        console.log((error as Error).message);
        res.status(500).json({status: false, message: 'Server internal error'});
    }
}


export default {
    getById
}