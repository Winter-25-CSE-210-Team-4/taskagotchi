import mongoose from 'mongoose';
import Task from "./Task";

export interface IGoal extends Document {
    name: string;
    description: string;
    deadline: Date;
    isCompleted: boolean;
    createdAt: Date;
    checkCompletion(): Promise<boolean>;
}



const goalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

goalSchema.methods.checkCompletion = async function (): Promise<boolean> {

    const tasks = await Task.find({ goal_id: this._id });

    if (tasks.length === 0) {

        return this.isCompleted;
    }


    const allCompleted = tasks.every(task => task.isCompleted);


    if (this.isCompleted !== allCompleted) {
        this.isCompleted = allCompleted;
        await this.save();
    }

    return allCompleted;
};

const Goal = mongoose.model<IGoal>('Goal', goalSchema);
export default Goal;