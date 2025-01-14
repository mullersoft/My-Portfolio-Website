import { Schema, model } from 'mongoose';

// Define the schema
export const StudentSchema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    quiz: { type: Number, required: true },
    test: { type: Number, required: true },
    assignment: { type: Number, required: true },
    project: { type: Number, required: true },
    midExam: { type: Number, required: true },
    finalExam: { type: Number, required: true },
    totalGrade: { type: Number, required: true },
  },
  {
    collection: 'students', // Specify the collection name explicitly
  },
);

// Create and export the model (optional)
export const StudentModel = model('Student', StudentSchema);
