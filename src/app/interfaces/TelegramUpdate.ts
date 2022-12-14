export interface ITelegramMessage {
  message_id: number,
  from: {
    id: number,
    is_bot: boolean,
    first_name: string,
    language_code: 'uk' | 'pl' | 'en' | 'ru' | string
  },
  chat: {
    id: number,
    first_name: string,
    type: string
  },
  date: number, // seconds
  text: string,
}

export interface ITelegramUpdate {
  update_id: number,
  message?: ITelegramMessage
  callback_query?: {
    id: string,
    from: {
      id: number,
      is_bot: boolean,
      first_name: string,
      language_code: string
    },
    message: ITelegramMessage,
    chat_instance: string,
    data?: string
  }
}
