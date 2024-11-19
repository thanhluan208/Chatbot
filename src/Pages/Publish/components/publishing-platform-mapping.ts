export interface PublishingPlatFormRecord {
  img: string | File;
  title: string;
  state: number;
  configure: Record<string, string>;
  subTitle: string;
}

export const publishingPlatformMapping: PublishingPlatFormRecord[] = [
  {
    img: '/src/assets/platform-icon/coze.jpeg',
    title: 'Coze Bot Store',
    state: 2,
    configure: {},
    subTitle:
      'The bot will appear in the Coze Bot Store. Bring more exposure and traffic to your bot!',
  },
  {
    img: '/src/assets/platform-icon/cici.jpg',
    title: 'Cici',
    state: 2,
    configure: {},
    subTitle: 'Publish your bot to Cici App, chat and share it with friends.',
  },
  {
    img: '/src/assets/platform-icon/discord.jpeg',
    title: 'Discord',
    state: 1,
    configure: {},
    subTitle:
      'Transform your bot into a Discord Bot, interacting live in Discord channels.',
  },
  {
    img: '/src/assets/platform-icon/telegram.png',
    title: 'Telegram',
    state: 1,
    configure: {},
    subTitle:
      'Interact with bots in Telegram private, group chats and channels',
  },
  {
    img: '/src/assets/platform-icon/messenger.png',
    title: 'Messenger',
    state: 1,
    configure: {},
    subTitle:
      'Chat with your bot on Messenger and use a Meta Business Account to share it with others.',
  },
  {
    img: '/src/assets/platform-icon/line.png',
    title: 'LINE',
    state: 1,
    configure: {},
    subTitle: 'Interact with your bot in LINE private chats.',
  },
  {
    img: '/src/assets/platform-icon/instagram.png',
    title: 'Instagram',
    state: 1,
    configure: {},
    subTitle: 'Connect the bot to Instagram Direct Messenger.',
  },
  {
    img: '/src/assets/platform-icon/slack.png',
    title: 'Slack',
    state: 1,
    configure: {},
    subTitle: 'Boost your Slack workspace productivity with Coze bots.',
  },
  {
    img: '/src/assets/platform-icon/lark.jpeg',
    title: 'Lark',
    state: 0,
    configure: {},
    subTitle:
      'Engage seamlessly with Lark through both group and one-to-one chat.',
  },
  {
    img: '/src/assets/platform-icon/whatsapp.png',
    title: 'WhatsApp',
    state: 1,
    configure: {},
    subTitle:
      'Simple, reliable, private messaging and calling for free*, available all over the world.',
  },
];

export const apiMapping: PublishingPlatFormRecord[] = [
  {
    img: '/src/assets/platform-icon/bot-api.jpeg',
    title: 'Bot as API',
    state: 2,
    configure: {},
    subTitle:
      'Public your bot to API. Add API Personal Access Token before publication.',
  },
  {
    img: '/src/assets/platform-icon/web-sdk.jpeg',
    title: 'Web SDK',
    state: 2,
    configure: {},
    subTitle: 'Deploy your bot as a Web SDK',
  },
];
