import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import IQuestions from 'interfaces/IQuetions.js';
import userModel from './user.model.js';

interface QuestionsInstance extends Model<IQuestions>, IQuestions {}
type QuestionsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): QuestionsInstance;
};

const questionsModel = db.define('questions', {
    id_question: DataTypes.STRING,
    id_user: DataTypes.STRING,
    ask: DataTypes.STRING,
    answer: DataTypes.STRING,
}, {
    freezeTableName: true,
    timestamps: false
}) as QuestionsModelStatic;

questionsModel.hasMany(userModel, { foreignKey: 'id_user' });
userModel.belongsTo(questionsModel, { foreignKey: 'id_user' });

export default questionsModel;