import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    title: {
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
    // status: {
    //     type: String,
    //     enum: ['active', 'completed', 'cancelled'],
    //     default: 'active'
    // },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Goal', goalSchema);