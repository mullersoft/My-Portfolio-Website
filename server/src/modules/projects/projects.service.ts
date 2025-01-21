import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  // Get a single project by ID
  async getProjectById(id: string): Promise<Project> {
    return this.projectModel.findById(id).exec();
  }

  // Create a new project
  async createProject(project: Partial<Project>): Promise<Project> {
    const newProject = new this.projectModel({
      ...project,
    });
    return newProject.save();
  }

  // Update a project
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    return this.projectModel
      .findByIdAndUpdate(id, project, { new: true })
      .exec();
  }

  // Delete a project
  async deleteProject(id: string): Promise<Project> {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
