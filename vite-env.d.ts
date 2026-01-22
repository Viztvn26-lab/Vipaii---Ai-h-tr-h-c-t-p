// Removed reference to vite/client which was causing errors
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
