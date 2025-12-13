// server/src/middlewares/ip-tracking.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CONTACT_BOT_CHAT_ID;
  private readonly ipInfoToken = process.env.IPINFO_TOKEN;

  private getTelegramApiUrl() {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  private async getGeoLocation(ip: string): Promise<string> {
    try {
      const res = await axios.get(
        `https://ipinfo.io/${ip}?token=${this.ipInfoToken}`
      );

      const {
        city,
        region,
        country,
        org,
        hostname,
      } = res.data;

      return `
Approx. Location: ${city || 'Unknown'}, ${region || 'Unknown'}, ${country || ''}
ISP / Org: ${org || 'Unknown'}
Hostname: ${hostname || 'N/A'}
      `.trim();
    } catch (error) {
      console.error('Geo lookup failed:', error.message);
      return 'Location unavailable (GeoIP lookup failed)';
    }
  }

  private async sendNotification(message: string) {
    try {
      await axios.post(this.getTelegramApiUrl(), {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error(
        'Telegram error:',
        error.response?.data || error.message
      );
    }
  }

  private extractIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string;

    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || req.ip;

    return ip === '::1' || ip === '127.0.0.1' ? '127.0.0.1' : ip;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl;

    if (url === '/' || url.startsWith('/project')) {
      const ip = this.extractIp(req);
      const ua = req.headers['user-agent'] || 'Unknown';
      const location =
        ip === '127.0.0.1'
          ? 'Localhost'
          : await this.getGeoLocation(ip);

      const message = `
🌐 <b>Portfolio Visit</b>

<b>IP:</b> ${ip}
<b>Page:</b> ${url}
<b>User Agent:</b> ${ua}

<b>${location}</b>
      `.trim();

      await this.sendNotification(message);
    }

    next();
  }
}
