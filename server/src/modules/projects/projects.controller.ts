import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.schema';

@Controller('projects') // Base route for projects
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Get all projects
  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  // Get a single project by ID
  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  // Create a new project
  @Post()
  async createProject(@Body() project: Partial<Project>): Promise<Project> {
    return this.projectsService.createProject(project);
  }

  // Update a project
  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() project: Partial<Project>,
  ): Promise<Project> {
    return this.projectsService.updateProject(id, project);
  }

  // Delete a project
  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<Project> {
    return this.projectsService.deleteProject(id);
  }
}
