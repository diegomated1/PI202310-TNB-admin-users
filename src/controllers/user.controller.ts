import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import bc from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';


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
            console.log(token);
            res.cookie("token",token,{
                httpOnly:true,
            })
            return res.status(200).json({ 'error': 0, 'message': "Bienvenido" });
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




const modifyUsersById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const params = req.params;
        const body = req.body;
        const user = await userModel.findByPk(params.id_user);
        if (user == null) {
            res.status(404).json({ info: 'usuario no existe' })
        } else {
            let body = req.body;
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

export default {
    auth,
    getById,
    login,
    modifyUsersById,
}