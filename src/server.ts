import { createApp } from './app';
import { log } from './logger';

const port = Number(process.env.PORT ?? 3000);

createApp().listen(port, () => {
  log('info', 'mini-shop listening', { port });
});
