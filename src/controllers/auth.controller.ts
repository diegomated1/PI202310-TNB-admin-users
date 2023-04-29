import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import bc from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ui from 'uniqid';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, name, second_name, email, password} = req.body;
        const user_email = await userModel.findOne({where: {email}});
        if (user_email) return res.json({ 'error': 2, 'message': 'Correo ya registrado' });
        const user_username = await userModel.findOne({where: {username}});
        if (user_username) return res.json({ 'error': 2, 'message': 'Usuario ya registrado' });

        const id_user = ui.process();
        const _password = await bc.hash(password, 10);
        await userModel.create({
            id_user, 
            username, name, second_name, 
            email, password: _password,
            id_roles: 4
        });

        var token = jwt.sign({ id_user }, process.env.JWT_SECRET!, { expiresIn :"24h"});
        res.cookie("token",token,{
            httpOnly:true,
        })
        return res.status(200).json({ 'error': 0, 'message': "Registrado" });
    } catch (error) {
        res.status(500).json({ 'error': 1, message: 'Server internal error' });
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        const _user = await userModel.findOne({where: {email}});
        if (_user === null) return res.json({ 'error': 2, 'message': 'Correo no registrado' });
        const _password = await bc.compare(password, _user.password);
        if (!_password) return res.json({ 'error': 3, 'message': 'Contraseña incorrecta' });
        else {
            var token = jwt.sign({ id_user: _user.id_user }, process.env.JWT_SECRET!, { expiresIn :"24h"});
            res.cookie("token",token,{
                httpOnly:true
            })
            return res.status(200).json({ 'error': 0, 'message': "Logeado" });
        }
    } catch (error) {
        res.status(500).json({ 'error': 1, message: 'Server internal error' });
    }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        try{
            var decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        }catch(err){
            return res.status(401).json({'error': 1, message: 'Invalid token'});
        }
        const user = await userModel.findByPk(decode.id_user);
        if(user){
            res.status(200).json({'error': 0, data: user});
        }else{
            return res.status(404).json({'error': 1, message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({ 'error': 2, message: 'Server internal error' });
    }
}

export default {
    login,
    register,
    auth
}

