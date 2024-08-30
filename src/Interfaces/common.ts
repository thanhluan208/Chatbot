export interface CustomTheme {
  colors?: {
    custom?: {};
  };
}
export interface commonBotCard {
  name: string;
  avatar: string;
  category?: string[];
  space: {
    avatar: string;
    name: string;
  };
  creator: {
    avatar?: string;
    name: string;
  };
  description: string;
}