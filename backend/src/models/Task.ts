import mongoose, { Schema, Document } from "mongoose";

// 定义 Task 接口
export interface ITask extends Document {
    user_id: mongoose.Types.ObjectId;
    goal_id: mongoose.Types.ObjectId;
    description: string;
    isCompleted: boolean;
    deadline?: Date;
    recurrs?: boolean;
    recurringUnit?: string; // Daily, Weekly, Monthly
}

// 定义 Task Schema
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

// 创建 Task 模型
const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;