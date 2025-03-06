import mongoose, { Schema, Document } from "mongoose";

// define the interface of Task
export interface ITask extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    deadline: Date;
    recurrs: boolean;
    recurringUnit: string; // 
    description: string;
    isCompleted: boolean;
    goal_id?: mongoose.Types.ObjectId; //new the task belong to which one
}

// define schema of task
const TaskSchema: Schema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date, required: true },
    recurrs: { type: Boolean, required: true },
    goal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },//new
    recurringUnit: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

// create Task Model
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
