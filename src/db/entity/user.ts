import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
    name: string;
    TeleId: string;
    balance: number;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    TeleId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 3000 },
});

export const User = model<IUser>("User", userSchema);
