// student-chat-id.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

@Schema()
export class StudentChatId extends Document {
  @Prop({ required: true, unique: true })
  chatId: number;
}

export const StudentChatIdSchema = SchemaFactory.createForClass(StudentChatId);

// Add an explicit index (optional)
StudentChatIdSchema.index({ chatId: 1 });

// Create and export the StudentChatIdModel
export const StudentChatIdModel = model('StudentChatId', StudentChatIdSchema);
