import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
const bc = require('bcrypt');
var jwt = require('jsonwebtoken');


const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const user = await userModel.findByPk(id_user);
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

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        const _user = await userModel.findOne({where: {email}});
        if (_user === null) return res.json({ 'error': 2, 'message': 'Correo no registrado' });
        const _password = await bc.compare(password, _user.password);
        if (!_password) return res.json({ 'error': 3, 'message': 'Contraseña incorrecta' });
        else {
            var token = jwt.sign({ id_user: _user.id_user }, process.env.JWT_SECRET!, { expiresIn :"15m"});
            res.cookie("token",token,{
                httpOnly:true,
            })
            return res.json({ 'error': 0, 'message': "Bienvenido" });
        }
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ 'error': 1, message: 'Server internal error' });
    }
}


export default {
    getById,
    login
}