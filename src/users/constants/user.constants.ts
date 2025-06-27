export const USER_CONSTANTS = {
  PASSWORD_HASH_ROUNDS: 10,
  DEFAULT_AVATAR_URL: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  DEFAULT_LOCATION: 'Kyiv',
  DEFAULT_PHONE: '+380000000000',
  TOKEN_EXPIRY: {
    ACCESS: '1h',
    REFRESH: '24h',
  },
  EMAIL: {
    FROM: 'lusiy321@gmail.com',
    SUBJECTS: {
      VERIFICATION: 'Email Verification from Swap',
      PASSWORD_CHANGE: 'Your password has been changed on Swap',
      PASSWORD_RESET: 'Reset your password on Swap',
    },
  },
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 20,
    PASSWORD_MIN_LENGTH: 8,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 13,
  },
};
