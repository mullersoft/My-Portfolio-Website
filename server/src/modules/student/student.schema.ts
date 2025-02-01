// D:\web D\portfolio-website\server\src\modules\student\student.schema.ts
import { Schema, model } from 'mongoose';

// Define the schema
export const StudentSchema = new Schema(
  {
    STUDENT_ID: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    ASSIGNMENT: { type: Number, required: true },
    TEST_1: { type: Number, required: true },
    TEST_2: { type: Number, required: true },
    PROJECT: { type: Number, required: true },
    MIDTERM: { type: Number, required: true },
    FINALTERM: { type: Number, required: true },
    TOTAL: { type: Number, required: true },
    chatId: { type: String, unique: true, sparse: true }, // Store Telegram chat ID
  },
  {
    collection: 'students',
  },
);

// Create an index for faster lookup
StudentSchema.index({ chatId: 1 });

export const StudentModel = model('Student', StudentSchema);
