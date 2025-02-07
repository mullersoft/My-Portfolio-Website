// D:\web D\portfolio-website\server\src\modules\contact\contact.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true }) // Adds createdAt and updatedAt fields
export class Contact {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  message: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
