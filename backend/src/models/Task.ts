import mongoose, { Schema, Document } from "mongoose";

// define the interface of Task
export interface ITask extends Document {
    user_id: mongoose.Types.ObjectId;
    goal_id: mongoose.Types.ObjectId;
    description: string;
    isCompleted: boolean;
    deadline?: Date;
    recurrs?: boolean;
    recurringUnit?: string; // Daily, Weekly, Monthly
}

// Define schema of task
const TaskSchema: Schema = new Schema({
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        goal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
        description: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        deadline: { type: Date, required: true },
        recurrs: { type: Boolean, default: false },
        recurringUnit: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
    },
    { timestamps: true }
);

// create Task Model
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;