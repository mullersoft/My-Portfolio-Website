import { Schema, Document, model } from 'mongoose';

export interface StudentChat extends Document {
  chatId: number;
}

const StudentChatSchema = new Schema<StudentChat>({
  chatId: { type: Number, required: true, unique: true },
});

export const StudentChatModel = model<StudentChat>('StudentChat', StudentChatSchema);
