import mongoose, { Schema, Document } from "mongoose";

// define Task interface
export interface ITask extends Document {
    user_id: mongoose.Types.ObjectId; // The task belongs to which user;
    goal_id: mongoose.Types.ObjectId; // The task belongs to which goal
    name: string;
    description: string;
    isCompleted: boolean;
    deadline?: Date;
    recurrs?: boolean;
    recurringUnit?: string; // Daily, Weekly, Monthly
}

// define Task Schema
const TaskSchema: Schema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    deadline: { type: Date, required: false },
    recurrs: { type: Boolean, required: false },
    recurringUnit: { type: String, enum: ["daily", "weekly", "monthly"], default: null },

},
    { timestamps: true }
);

// create task model
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;