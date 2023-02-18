import { Router } from "express";
import userController from "../controllers/user.controller.js";

class UserRouter {

    router:Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    private config(){
        // GET users/:id_user      TRAE UN USUARIO CON SU ID
        
        this.router.route('/users/:id_user').get(userController.getById);
    }
}

export default new UserRouter();


