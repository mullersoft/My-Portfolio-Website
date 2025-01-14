import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  link: string;
  @Prop([String]) // Array of strings
  techStack: string[];

  @Prop()
  githubLink: string;

  @Prop()
  deploymentLink: string; // Deployment (live project) link
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
