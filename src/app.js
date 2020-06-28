import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import OneSignal from 'react-native-onesignal';
import { Transition } from 'react-native-reanimated';
import { createAppContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import MainApp from './main_screens/main_app_screen';
import MainLoginScreen from './main_screens/main_login_screen';
import app_reducer from './reducers/auth_reducer';
import DropDownHolder from './util/DropDownHandler';
import NotificationHandler from './util/NotificationHandler';
import SplashScreen from 'react-native-splash-screen';

const persistConfig = {
    // Root
    key: 'root_main',
    // Storage Method (React Native)
    storage: AsyncStorage
  };
const persistedReducer = persistReducer(persistConfig, app_reducer);

const logger = createLogger({
    duration: true
});

const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
const persistor = persistStore(store);

const MainNavigator = createAnimatedSwitchNavigator({
    MainAppScreen: {screen: MainApp, 
            navigationOptions: {
                header: null
            }
        },
    MainLoginScreen: {screen: MainLoginScreen, 
            navigationOptions: {
                header: null
            }
        },
    },{
    initialRouteName: 'MainLoginScreen', //TODO Change to 'Home' if User is LoggedIn
    transition: (
        <Transition.Together>
            <Transition.Out
                type="scale"
                durationMs={350}
                interpolation="easeIn"
            />
            <Transition.In type="scale" 
            durationMs={350}
                interpolation="easeIn"/>
        </Transition.Together>
    ),
    });

const App = createAppContainer(MainNavigator);

class ElimooMainApp extends React.Component {
    constructor(props){
        super(props);     
    }
    componentDidMount() {
        SplashScreen.hide()
    }
    
    render() {
        return <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
                <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)}
                inactiveStatusBarBackgroundColor="#FF9E02"
                updateStatusBar={false}
                errorColor="#FF9E02"
                closeInterval={5000}
                translucent={true}/>
            </PersistGate>
        </Provider>;
    }
}
function myiOSPromptCallback(permission){
    // do something with permission value
}
// const ElimooMainApp = <Provider store={store}>
//     <App/>
// </Provider>
export default ElimooMainApp;
