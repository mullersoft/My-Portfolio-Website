import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class StudentChatId extends Document {
  @Prop({ required: true, unique: true })
  chatId: number;
}

export const StudentChatIdSchema = SchemaFactory.createForClass(StudentChatId);
