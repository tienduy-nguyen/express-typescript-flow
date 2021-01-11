declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly SERVER_PORT: string;
    readonly DB_TYPE: string;
    readonly DB_HOST: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_PORT: string;
  }
}
