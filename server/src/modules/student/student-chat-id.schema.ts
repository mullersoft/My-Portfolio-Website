import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentChatId extends Document {
  chatId: number;
}

const StudentChatIdSchema = new Schema<IStudentChatId>({
  chatId: { type: Number, required: true, unique: true },
});

export const StudentChatId = mongoose.model<IStudentChatId>(
  'StudentChatId',
  StudentChatIdSchema,
);
