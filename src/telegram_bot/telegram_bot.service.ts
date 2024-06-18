import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { UserSmmPackRelation } from 'src/users_smm_pack_relationship/entities/users_smm_pack_relation.entity';
import { CallbackQuery, Message } from 'node-telegram-bot-api';
import { UserSettingsService } from 'src/user_settings/user_settings.service';
import { UserSmmPackRelationService } from 'src/users_smm_pack_relationship/users_smm_pack_relation.service';
import { UsersService } from 'src/users/users.service';
import { TgChannelsService } from 'src/tg_channel/tg_channels.service';
import { IPostTo } from 'src/post/dto/post-settings';

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;
  constructor(
    @Inject(UserSettingsService)
    private usersSettingsService: UserSettingsService,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(UserSmmPackRelationService)
    private userSmmPackRelationService: UserSmmPackRelationService,

    @Inject(TgChannelsService)
    private tgChannelsService: TgChannelsService,
  ) {
    this.bot = new TelegramBot(process.env.BOT_TOKEN);

    this.bot.onText(/\/start/, (msg: Message) => this.start(msg));
    this.bot.on('callback_query', (query) => this.handleCallbackQuery(query));
    this.bot.on('message', (msg) => {
      if (msg.forward_from_chat && msg.forward_date) {
        this.handleForwardedMessage(msg);
      }
    });
  }

  async sendPost(text: string, post_to: IPostTo[]): Promise<number[] | false> {
    try {
      let sent_to = [];
      post_to.forEach(async (postTo: IPostTo) => {
        if (postTo.sm === 'telegram') {
          await this.sendMessageToTelegram(parseInt(postTo.id), text);
        }
        sent_to.push(parseInt(postTo.id));
      });
      return sent_to;
    } catch (error) {
      return false;
    }
  }

  async startConversation(chatId: number) {
    // check that there exists a user with the telegram id
    try {
      const user = await this.usersService.findOneBy({ telegram: chatId });
      if (!user) {
        return false;
      }
      this.bot.sendMessage(
        chatId,
        'Shalom and Welcome! Welcome to AIGram! With me you can add a new telegram channel. To do that, simply give me admin rights in the channel and forward any message from the channel to me. I am waiting!',
      );
      return true;
    } catch (error) {
      throw new Error('Error starting conversation');
    }
  }

  async setWebhook() {
    await this.bot.closeWebHook();
    const webhookUrl = `${process.env.URL}/api/telegram-bot/${process.env.BOT_TOKEN}`;
    const setWebhook = await this.bot.setWebHook(webhookUrl);
  }

  async handleUpdate(body: any) {
    this.bot.processUpdate(body);
  }

  async start(msg: Message) {
    // check that the message is coming from private chat
    if (msg.chat.type !== 'private') return;

    // Check that the user is registered in the system
    const telegram = msg.chat.id;
    const user = await this.usersService.findOneBy({ telegram });
    if (!user) {
      // TODO add markuop so that link has an actual link in it
      this.bot.sendMessage(
        telegram,
        "You are not registered or not haven't linked your account to telegram. Please, visit smm.telesens.ua and link your account to telegram.",
      );
      return;
    }
    return this.chooseSmmPack(user.id, telegram);
  }

  async handleCallbackQuery(callbackQuery: CallbackQuery) {
    // check that the message is coming from private messages
    if (callbackQuery.message.chat.type !== 'private') return;
    if (callbackQuery.data.startsWith('sp_')) {
      const smmPackId = callbackQuery.data.split('_').pop();
      const keyboard = callbackQuery.message.reply_markup.inline_keyboard;
      // keyboard is an array of arrays of objects that have text and callback_data properties. Find me the one that has the callback_data equal to the one that was clicked
      const smmPack = keyboard.find((row) =>
        row.find((button) => button.callback_data === callbackQuery.data),
      );
      const { text: name } = smmPack[0];
      const user = await this.usersService.findOneBy({
        telegram: callbackQuery.message.chat.id,
      });
      this.usersSettingsService.update(user.id, {
        current_smm_pack_tg: smmPackId,
      });
      return this.bot.sendMessage(
        callbackQuery.message.chat.id,
        `You have chosen ${name} smm pack. Now, to link a telegram channel to this pack, please complete the following steps:
        1. Add me to the channel as an admin with permission to write messages
        2. Send into the current chat any message from the channel you wish to link`,
      );
    }
  }

  async chooseSmmPack(user_id: string, chat_id: number) {
    const smmPacks: UserSmmPackRelation[] =
      (await this.userSmmPackRelationService.findRelations({
        user_id: user_id,
        relations: true,
      })) as UserSmmPackRelation[];
    if (!smmPacks.length) {
      return this.bot.sendMessage(
        chat_id,
        'You have no smm packs. Please, add a new one',
      );
    }
    // create an inline keyboard with smm packs' names
    const keyboard = smmPacks.map((pack) => [
      {
        text: pack.smm_pack.name,
        callback_data: `sp_${pack.smm_pack.id}`,
      },
    ]);
    return this.bot.sendMessage(
      chat_id,
      'Choose an smm pack for which to add telegram channel',
      {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
  }

  async handleForwardedMessage(msg: Message) {
    // check that the message is forwarded from the channel
    if (!msg.forward_from_chat || msg.forward_from_chat.type !== 'channel') {
      return this.bot.sendMessage(
        msg.chat.id,
        'Message you sent is not from a channel. Please, forward a message from a channel you want to link to the smm pack.',
      );
    }

    // check that the bot is an admin in the channel with write permissions
    const chatId = msg.forward_from_chat.id;
    const botId = (await this.bot.getMe()).id;
    const isBotAdmin = await this.bot
      .getChatMember(chatId, botId)
      .then((chatMember) => {
        return (
          chatMember.status === 'administrator' && chatMember.can_post_messages
        );
      })
      .catch(() => false);
    if (!isBotAdmin) {
      return this.bot.sendMessage(
        msg.chat.id,
        'I am not an admin in the channel. Please, add me as an admin with permission to write messages.',
      );
    }

    // check that the user forwarding the message is an admin in a channel
    const userId = msg.from.id;
    const isAdmin = await this.bot
      .getChatMember(chatId, userId)
      .then((chatMember) => {
        return (
          chatMember.status === 'administrator' ||
          chatMember.status === 'creator'
        );
      })
      .catch(() => false);
    if (!isAdmin) {
      return this.bot.sendMessage(
        msg.chat.id,
        'You are not an admin in the channel. Please, forward a message from a channel where you are an admin.',
      );
    }

    // obtain current_smm_pack_tg from user settings
    const user = await this.usersService.findOneBy(
      { telegram: msg.chat.id },
      true,
    );
    const smmPackId = user.userSettings.current_smm_pack_tg;

    // Check that the user has a current smm pack
    if (!smmPackId) return this.chooseSmmPack(user.id, msg.chat.id);

    // obtain name of the channel, id of the channel, username of the channel(if exists, otherwise null)
    const {
      title: channelName,
      id: channelId,
      username: channelUsername,
    } = msg.forward_from_chat;

    // check that the channel is not already linked to the smm pack
    const channel = await this.tgChannelsService.findOne(channelId);
    if (channel) {
      return this.bot.sendMessage(
        msg.chat.id,
        'This channel is already linked to the smm pack',
      );
    }

    // create a new telegram channel
    const newChannel = {
      id: channelId,
      username: channelUsername,
      name: channelName,
      smm_pack_id: smmPackId,
    };
    await this.tgChannelsService.create(newChannel);
    this.bot.sendMessage(
      msg.chat.id,
      'Channel has been successfully linked to the smm pack',
    );
  }

  async sendMessageToTelegram(chatId: number, text: string) {
    const message = await this.bot.sendMessage(chatId, text);
  }
}
