// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Initialize ConfigModule to load .env variables
    MongooseModule.forRoot(process.env.MONGO_URI), // Use MONGO_URI from .env
    UsersModule,
    ProjectsModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
