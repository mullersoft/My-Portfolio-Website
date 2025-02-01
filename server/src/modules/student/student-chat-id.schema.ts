import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript type-checking
export interface IStudentChatId extends Document {
  chatId: number;
}

// Schema definition with an index for faster lookups
const StudentChatIdSchema = new Schema<IStudentChatId>({
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
});

// Adding an index on chatId to improve query performance
StudentChatIdSchema.index({ chatId: 1 });

// Create and export the model
export const StudentChatId = mongoose.model<IStudentChatId>(
  'StudentChatId',
  StudentChatIdSchema,
);
