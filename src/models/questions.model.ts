import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import IQuestions from 'interfaces/IQuetions.js';

interface QuestionsInstance extends Model<IQuestions>, IQuestions {}
type QuestionsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): QuestionsInstance;
};

export default db.define('questions', {
    id_question: DataTypes.STRING,
    ask: DataTypes.STRING,
    answer: DataTypes.STRING,
}, {
    freezeTableName: true,
    timestamps: false
}) as QuestionsModelStatic;
