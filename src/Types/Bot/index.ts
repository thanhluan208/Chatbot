export interface ListBotResponse {
    status_code: number;
    message: string;
    list_bots: ListBot[];
  }
  
  export interface ListBot {
    bot_id: string;
    bot_name: string;
    description: string;
    owner_id: string;
    created_at: Date;
    user_name: string;
    permission_level: string;
    visibility: string;
    avatar_url: string;
  }