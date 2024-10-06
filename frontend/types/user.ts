export type User = {
  email: string;
  full_name: string;
  token: string;
  created: string;
};

export type UserLoginPayload = {
  username: string;
  password: string;
};
