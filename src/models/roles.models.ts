import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import IRoles from 'interfaces/IRoles.js';

interface RolesInstance extends Model<IRoles>, IRoles {}
type RolesModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): RolesInstance;
};

export default db.define('roles', {
    id_roles: {
      primaryKey: true,
      type: DataTypes.STRING},
      roles_name: DataTypes.STRING,
      description:DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: false
}) as RolesModelStatic;
