import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import bc from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ui from 'uniqid';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, email, password} = req.body;
        const _user = await userModel.findOne({where: {email}});
        if (_user) return res.json({ 'error': 2, 'message': 'Correo ya registrado' });

        const id_user = ui.time();
        await userModel.create({
            id_user,
            username: username,
            email: email,
            password: await bc.hash(password, 10),
            id_roles: 4
        });

        var token = jwt.sign({ id_user }, process.env.JWT_SECRET!, { expiresIn :"24h"});
        res.cookie("token",token,{
            httpOnly:true,
        })
        return res.status(200).json({ 'error': 0, 'message': "Registrado" });
    } catch (error) {
        console.log((error as Error).message);
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
            console.log(token);
            res.cookie("token",token,{
                httpOnly:true,
            })
            return res.status(200).json({ 'error': 0, 'message': "Logeado" });
        }
    } catch (error) {
        console.log((error as Error).message);
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
            return res.status(401).json({'error': 1, message: 'Invalid token'});
        }
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ 'error': 2, message: 'Server internal error' });
    }
}

export default {
    login,
    register,
    auth
}

