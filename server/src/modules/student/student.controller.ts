// D:\web D\portfolio-website\server\src\modules\student\student.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get(':studentId')
  async getStudentGrade(@Param('studentId') studentId: string) {
    const decodedStudentId = decodeURIComponent(studentId);
    return await this.studentService.getStudentGrade(decodedStudentId);
  }
}
