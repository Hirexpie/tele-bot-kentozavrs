import { Schema, model, Document } from "mongoose";

interface IKred extends Document {
    sum: number;
    moth: number;
    userId: string;
    isMoth: boolean;
    createDate?: Date;
}

const kredSchema = new Schema<IKred>({
    sum: { type: Number, required: true },
    moth: { type: Number, required: true },
    userId: { type: String, required: true },
    isMoth: { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now }
});


export const Kred = model<IKred>("Kredit", kredSchema);
