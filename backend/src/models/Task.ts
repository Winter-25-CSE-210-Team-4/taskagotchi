import mongoose, { Schema, Document, CallbackError } from "mongoose";

// define the interface of Task
export interface ITask extends Document {
    task_id: number;
    user_id: number;
    deadline?: Date;
    recurrs: boolean;
    recurringUnit: string; // daily, weekly, monthly
    description: string;
    isCompleted: boolean;
    goal_id?: mongoose.Types.ObjectId; // the task belongs to which goal
    title: string;
}

// define schema of task
const TaskSchema: Schema = new Schema({
    task_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    deadline: { type: Date, required: false },
    recurrs: { type: Boolean, required: true },
    goal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    recurringUnit: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    title: { type: String, required: true }
},
    { timestamps: true }
);

// Auto-increment task_id
TaskSchema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
        try {
            const lastTask = await Task.findOne({}, {}, { sort: { 'task_id': -1 } });
            doc.task_id = lastTask ? lastTask.task_id + 1 : 1;
            next();
        } catch (error) {
            next(error as CallbackError);
        }
    } else {
        next();
    }
});

// create Task Model
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;