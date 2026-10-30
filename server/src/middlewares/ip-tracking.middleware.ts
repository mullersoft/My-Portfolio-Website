// server/src/middlewares/ip-tracking.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CONTACT_BOT_CHAT_ID;
  private readonly ipInfoToken = process.env.IPINFO_TOKEN;

  // Same IP + page is reported only once per 30 minutes
  private seen = new Map<string, number>();

  // Main source: free, no token, includes city
  private async lookupIpWho(ip: string): Promise<string | null> {
    try {
      const { data } = await axios.get(`https://ipwho.is/${ip}`, {
        timeout: 4000,
      });
      if (!data.success) {
        console.error('ipwho.is failed:', data.message);
        return null;
      }
      return [
        `Approx. Location: ${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country || ''}`,
        `ISP / Org: ${data.connection?.isp || 'Unknown'}`,
        `Map: https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
      ].join('\n');
    } catch (e: any) {
      console.error('ipwho.is failed:', e.response?.status, e.message);
      return null;
    }
  }

  // Backup: ipinfo Lite (free plan, country + network only)
  private async lookupIpInfoLite(ip: string): Promise<string | null> {
    if (!this.ipInfoToken) {
      console.error('IPINFO_TOKEN is missing in environment variables');
      return null;
    }
    try {
      const { data } = await axios.get(`https://api.ipinfo.io/lite/${ip}`, {
        headers: { Authorization: `Bearer ${this.ipInfoToken}` },
        timeout: 4000,
      });
      return [
        `Approx. Location: ${data.country || 'Unknown'} (country only)`,
        `ISP / Org: ${data.as_name || 'Unknown'}`,
      ].join('\n');
    } catch (e: any) {
      console.error(
        'ipinfo failed:',
        e.response?.status,
        e.response?.data || e.message,
      );
      return null;
    }
  }

  private async getGeoLocation(ip: string): Promise<string> {
    return (
      (await this.lookupIpWho(ip)) ??
      (await this.lookupIpInfoLite(ip)) ??
      'Location unavailable (GeoIP lookup failed)'
    );
  }

  private extractIp(req: Request): string {
    const cf = req.headers['cf-connecting-ip'] as string | undefined;
    const fwd = (req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      .trim();
    const ip = cf || fwd || req.socket.remoteAddress || req.ip || '';
    return ip.replace('::ffff:', '');
  }

  private async notify(ip: string, url: string, ua: string) {
    const geo = ['127.0.0.1', '::1'].includes(ip)
      ? 'Localhost'
      : await this.getGeoLocation(ip);

    const message = [
      '🌐 <b>Portfolio Visit</b>',
      '',
      `<b>IP:</b> ${escapeHtml(ip)}`,
      `<b>Page:</b> ${escapeHtml(url)}`,
      `<b>User Agent:</b> ${escapeHtml(ua)}`,
      '',
      escapeHtml(geo),
    ].join('\n');

    try {
      await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        },
        { timeout: 5000 },
      );
    } catch (e: any) {
      console.error('Telegram error:', e.response?.data || e.message);
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl;

    if (url === '/' || url.startsWith('/project')) {
      const ip = this.extractIp(req);
      const ua = (req.headers['user-agent'] as string) || 'Unknown';

      const key = `${ip}|${url}`;
      const last = this.seen.get(key) ?? 0;

      if (Date.now() - last > 30 * 60 * 1000) {
        this.seen.set(key, Date.now());
        // Fire-and-forget so visitors are not slowed down
        this.notify(ip, url, ua).catch(() => undefined);
      }
    }

    next();
  }
}