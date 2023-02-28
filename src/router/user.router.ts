import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authController from '../controllers/auth.controller.js';
class UserRouter {

    router:Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    private config(){
        this.router.route('/auth').post(authController.auth);
        this.router.route('/auth/login').post(authController.login);
        this.router.route('/auth/register').post(authController.register);

        this.router.route('/user/:id_user').get(userController.getById);
        this.router.route('/user/:id_user').put(userController.modifyUsersById);
    }
}

export default new UserRouter();


