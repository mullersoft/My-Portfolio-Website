// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { UsersModule } from './modules/users/users.module'; // Import UsersModule
import { ProjectsModule } from './modules/projects/projects.module'; // Import ProjectsModule
import { ContactModule } from './modules/contact/contact.module'; // Import ContactModule

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/your-database-name'), // MongoDB connection
    UsersModule, // Import UsersModule
    ProjectsModule, // Import ProjectsModule
    ContactModule, // Import ContactModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
