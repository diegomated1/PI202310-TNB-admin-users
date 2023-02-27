import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import IUser from '../interfaces/IUser.js';

interface UserInstance extends Model<IUser>, IUser {}
type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserInstance;
};

export default db.define('users', {
    id_user: {
      primaryKey: true,
      type: DataTypes.STRING},
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id_roles:{
      type:DataTypes.STRING,
      references:{
        model:'roles',
        key:'id_roles'
      }
    }
}, {
    freezeTableName: true,
    timestamps: false
}) as UserModelStatic;
