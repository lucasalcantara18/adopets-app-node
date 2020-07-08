import 'dotenv/config'
import App from './app';
import { validateEnv } from './utils/utils';

validateEnv();

const app = new App();
app.listen();