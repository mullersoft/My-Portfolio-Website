import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatGptService {
  async getChatResponse(prompt: string): Promise<string> {
    const message = prompt.toLowerCase();

    // ---- ABOUT YOU ----
    if (message.includes('who are you') || message.includes('about you')) {
      return `
I am an AI assistant for Mulugeta Linger.

Mulugeta is a Software Engineer, Lecturer, and Researcher with strong experience in:
• Full-stack web development
• Odoo ERP
• AI & Cybersecurity research
• Automation and cloud systems
`;
    }

    // ---- SERVICES ----
    if (message.includes('service') || message.includes('offer')) {
      return `
Here are the services offered:

1. Full-stack web development (MERN, Laravel, TypeScript)
2. Odoo ERP customization & module development
3. SharePoint, PowerApps & workflow automation
4. AI-powered chatbots and automation
5. API development & system integration
6. Secure backend & database design
`;
    }

    // ---- PROJECTS ----
    if (message.includes('project')) {
      return `
Highlighted projects include:

• MessageHub – MERN + TypeScript web app
• Event Management System – Geo-based backend
• AI-based XSS attack detection (CNN-BiLSTM)
• Music Management System (MERN stack)
`;
    }

    // ---- PUBLICATIONS ----
    if (message.includes('publication') || message.includes('paper')) {
      return `
Publications:

1. Enhancing Cross-Site Scripting Attack Detection using CNN-BiLSTM and Online Learning
2. Intelligent Fault Diagnosis for Bearings using Deep Transfer Learning

Both published in Springer.
`;
    }

    // ---- CONTACT ----
    if (
      message.includes('contact') ||
      message.includes('email') ||
      message.includes('reach')
    ) {
      return `
You can contact Mulugeta via the contact form on this website
or connect through LinkedIn and GitHub.
`;
    }

    // ---- DEFAULT FALLBACK ----
    return `
Thanks for your message 😊

I can help you with:
• Services
• Projects
• Publications
• Contact information

Please ask about any of these.
`;
  }
}
