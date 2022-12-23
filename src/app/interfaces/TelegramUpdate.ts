export interface ITelegramUpdate {
  update_id: number,
  message: {
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
}
