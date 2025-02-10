import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CONTACT_BOT_CHAT_ID;

  private getTelegramApiUrl() {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  private async getGeoLocation(ipAddress: string): Promise<string> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      const { country, city, status, query } = response.data;

      if (status === 'success' && country && city) {
        return `${city}, ${country}`;
      } else {
        console.warn(
          `Incomplete or failed location data for IP ${query}:`,
          response.data,
        );
        return 'Unknown Location';
      }
    } catch (error) {
      console.error('Error fetching geo-location:', error.message);
      return 'Unknown Location';
    }
  }

  private async sendNotificationToTelegram(message: string) {
    try {
      await axios.post(this.getTelegramApiUrl(), {
        chat_id: this.chatId,
        text: message,
      });
    } catch (error) {
      console.error(
        'Error sending notification to Telegram:',
        error.response?.data || error.message,
      );
    }
  }

  private extractIpAddress(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'] as string;
    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : req.connection.remoteAddress || req.ip;

    return ipAddress === '::1' || ipAddress === '127.0.0.1'
      ? '127.0.0.1'
      : ipAddress;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const requestedUrl = req.originalUrl;

    // Send notifications only for homepage ("/") and projects ("/project")
    if (requestedUrl === '/' || requestedUrl.startsWith('/project')) {
      const ipAddress = this.extractIpAddress(req);
      const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
      const location =
        ipAddress === '127.0.0.1'
          ? 'Localhost'
          : await this.getGeoLocation(ipAddress);

      const notificationMessage = `🌐 Website Visit:\n\nIP Address: ${ipAddress}\nLocation: ${location}\nPage: ${requestedUrl}\nUser-Agent: ${userAgent}`;

      await this.sendNotificationToTelegram(notificationMessage);
    }

    next();
  }
}
