interface IText<T={[k: string]: string}> {
  uk: T,
  pl: T,
  en: T,
  ru: T,
}

export const TEXTS: IText = {
  uk: {
    START_MESSAGE: 'Вітаємо в чаті телеграм-боту від Free Border. Будь ласка, виберіть мову:',
    CURRENT_LANG: 'Пропустити'
  },
  pl: {},
  en: {},
  ru: {},
}