import {AppRegistry} from 'react-native';
import ElimooMainApp from './src/app';
import {name as appName} from './app.json';
import * as Sentry from '@sentry/react-native';
    
Sentry.init({ 
  dsn: 'https://bcb207d8a7db4830a79d24b01f7d2bb7@o405222.ingest.sentry.io/5270498', 
});

AppRegistry.registerComponent(appName, () => ElimooMainApp);