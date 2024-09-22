export interface IAppInfo {
  title: string;
  description: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export type AppState = {
  token: string;
  login: (payload: ILogin) => Promise<void>;
};
