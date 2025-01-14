// D:\web D\portfolio-website\server\src\modules\student\student.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private readonly studentModel: Model<any>,
  ) {}

  async getStudentGrade(studentId: string) {
    const student = await this.studentModel.findOne({ studentId });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }
}
