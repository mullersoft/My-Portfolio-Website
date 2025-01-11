import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CHAT_ID;

  private getTelegramApiUrl() {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  private async getGeoLocation(ipAddress: string): Promise<string> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      const { country, city, status, query } = response.data;
      
      if (status !== 'success' || !country || !city) {
        console.warn(`Incomplete or failed location data for IP ${query}:`, response.data);
        return 'Unknown Location';
      }
      
      return `${city}, ${country}`;
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
      console.error('Error sending notification to Telegram:', error.response?.data || error.message);
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    let ipAddress = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || req.ip;
    ipAddress = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;

    if (ipAddress === '::1' || ipAddress === '127.0.0.1') {
      ipAddress = '127.0.0.1'; // Normalize localhost IP
    }

    const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
    const requestedUrl = req.originalUrl;
    const location = ipAddress === '127.0.0.1' ? 'Localhost' : await this.getGeoLocation(ipAddress);

    const notificationMessage = `🌐 New Website Visit:\n\nIP Address: ${ipAddress}\nLocation: ${location}\nPage: ${requestedUrl}\nUser-Agent: ${userAgent}`;

    await this.sendNotificationToTelegram(notificationMessage);

    next();
  }
}
