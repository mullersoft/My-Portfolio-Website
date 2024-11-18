import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  link: string; // Main project link (can be the project page or demo)

  // Adding techStack as an array of strings
  @Prop([String]) // Array of strings
  techStack: string[];

  // Adding GitHub and Deployment site links
  @Prop()
  githubLink: string; // GitHub repository link

  @Prop()
  deploymentLink: string; // Deployment (live project) link
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
