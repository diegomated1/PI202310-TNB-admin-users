import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import IQuestions from 'interfaces/IQuetions.js';

interface UserQuestionsInstance extends Model<IQuestions>, IQuestions {}
type QuestionsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserQuestionsInstance;
};

export default db.define('user_questions', {
    id_user_question: DataTypes.STRING,
    id_user: {
        type:DataTypes.STRING,
        references:{
          model:'roles',
          key:'id_roles'
        }
    },
    id_question: {
        type:DataTypes.STRING,
        references:{
          model:'roles',
          key:'id_roles'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false
}) as QuestionsModelStatic;
