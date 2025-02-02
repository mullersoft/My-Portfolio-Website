// project.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

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

// Create indexes based on your queries
ProjectSchema.index({ title: 1 }); // Index on title for quick searches by title
ProjectSchema.index({ techStack: 1 }); // Index on techStack for searches based on tech stack
ProjectSchema.index({ githubLink: 1 }); // Index on githubLink for searches based on github link

// Create and export the ProjectModel
export const ProjectModel = model('Project', ProjectSchema);
