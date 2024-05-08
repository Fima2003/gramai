import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { TelegramBotService } from './telegram_bot.service';

@Controller('telegram-bot')
export class TelegramBotController {
  constructor(private botService: TelegramBotService) {}

  @Get('*')
  async setWebhook(@Req() req: any, @Res() res: any) {
    const path = req.path;
    if (path == `/api/telegram-bot/${process.env.BOT_TOKEN}/set-webhook`) {
      await this.botService.setWebhook();
      return res.status(200).send('OK');
    }
    return res.status(404).send('Not Found');
  }

  @Post('*')
  async handleUpdate(@Req() req: any, @Res() res: any) {
    const path: string = req.path;
    const token = path.split('/').pop();

    if (token !== process.env.BOT_TOKEN) {
      return res.status(404).send('Not Found');
    }
    if (req.body) {
      this.botService.handleUpdate(req.body);
      return res.status(200).send('OK');
    } else {
      return res.status(500).send('Wrong data format');
    }
  }
}
