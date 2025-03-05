import mongoose, { Document, Model } from 'mongoose';

// Modifiable constants
const MAX_HEALTH = 100;
const PET_PFPS = [];    // TODO: Add pet profile pictures

interface IPet {
    pet_id: number;
    name: string;
    health: number;
    level: number;
    exp: number;
    pfp: Buffer;
    user: mongoose.Schema.Types.ObjectId;
}

interface IPetDocument extends IPet, Document {
    levelUp(): Promise<void>;
    getRequiredExp(level: number): number;
    setPfp(imageBuffer: Buffer): Promise<void>;
    gainExp(amount: number): Promise<void>;
}

interface IPetModel extends Model<IPetDocument> {
    // Add static methods here if needed
}

const petSchema = new mongoose.Schema<IPetDocument>({
    pet_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    health: {
        type: Number,
        required: true,
        default: MAX_HEALTH,
        max: [MAX_HEALTH, `Health cannot exceed ${MAX_HEALTH}`],
        min: [0, 'Health cannot be negative']
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    exp: {
        type: Number,
        required: true,
        default: 0
    },
    pfp: {
        type: Buffer,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Calculates the experience the pet needs level up to the next level
petSchema.methods.getRequiredExp = function (level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
};

// Levels up the pet to its appropriate level if it has enough experience
petSchema.methods.levelUp = async function (this: IPetDocument): Promise<void> {
    while (this.exp >= this.getRequiredExp(this.level)) {
        this.level += 1;
        this.health = MAX_HEALTH; // Reset health to max when leveling up
    }
    await this.save();
};

// Sets the pet's profile picture
petSchema.methods.setPfp = async function (this: IPetDocument, imageBuffer: Buffer): Promise<void> {
    this.pfp = imageBuffer;
    await this.save();
};

// Pet gains experience
petSchema.methods.gainExp = async function (this: IPetDocument, amount: number): Promise<void> {
    if (amount < 0) return; // Prevent negative exp gains

    this.exp += amount;
    await this.levelUp(); // Check if we can level up after gaining exp
    await this.save();
};

const Pet = mongoose.model<IPetDocument, IPetModel>('Pet', petSchema);
export default Pet;