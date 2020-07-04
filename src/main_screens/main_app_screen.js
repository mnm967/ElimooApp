import { createStackNavigator } from 'react-navigation-stack';
import MainNavigation from '../views/main_navigation';
import DealView from '../views/deal_view';
import { createAppContainer } from 'react-navigation';
import DealRedeemView from '../views/deal_redeem_view';
import DealInStorePin from '../views/deal_in_store_pin';
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'
import DealQRReader from '../views/deal_qr_reader';
import DealStorePassword from '../views/deal_store_password';
import DealCompleteView from '../views/deal_complete_view';
import DealUsageLimitView from '../views/deal_usage_limit_view';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import UserIDScreen from '../views/user_id_screen';
import CategoryScreen from '../views/category_screen';
import SearchScreen from '../views/search_screen';
import PolicyScreen from '../views/policy_screen';
import SettingsScreen from '../views/settings_screen';
import ChangePasswordScreen from '../views/change_password_screen';
import SpecialDealsScreen from '../views/special_deals_screen';
import TopTipsScreen from '../views/top_tips_screen';
import * as React from 'react';

changeNavigationBarColor("#FF9E02");

class MainApp extends React.Component{
  mainNavigation = (newRoute) => {
    const { navigate } = this.props.navigation;
    navigate(newRoute);
  }
  state = {};
  render(){
    const MainAppStack = createStackNavigator({
      MainHome: {screen: MainNavigation,
        navigationOptions: {
            header: null,
        }, params: {mainNavigation: this.mainNavigation}
      },
      Deal: {screen: DealView,
        navigationOptions: {
            header: null
        }, params: {mainNavigation: this.mainNavigation}
      },
      DealRedeem: {screen: DealRedeemView,
        navigationOptions: {
            header: null
        }
      },
      DealInStorePin: {screen: DealInStorePin,
        navigationOptions: {
            header: null
        }
      },
      DealQRReader: {screen: DealQRReader,
        navigationOptions: {
            header: null
        }
      },
      DealStorePassword: {screen: DealStorePassword,
        navigationOptions: {
            header: null
        }
      },
      DealCompleteView: {screen: DealCompleteView,
        navigationOptions: {
            header: null
        }
      },
      DealUsageLimitView: {screen: DealUsageLimitView,
        navigationOptions: {
            header: null
        }
      },
      UserIDScreen: {screen: UserIDScreen,
        navigationOptions: {
            header: null
        }
      },
      CategoryScreen: {screen: CategoryScreen,
        navigationOptions: {
            header: null
        }
      },
      SearchScreen: {screen: SearchScreen,
        navigationOptions: {
            header: null
        }
      },
      PolicyScreen: {screen: PolicyScreen,
        navigationOptions: {
            header: null
        }
      },
      SettingsScreen: {screen: SettingsScreen,
        navigationOptions: {
            header: null
        }
      },
      ChangePasswordScreen: {screen: ChangePasswordScreen,
        navigationOptions: {
            header: null
        }
      },
      SpecialDealsScreen: {screen: SpecialDealsScreen,
        navigationOptions: {
            header: null
        }
      },
      TopTipsScreen: {screen: TopTipsScreen,
        navigationOptions: {
            header: null
        }
      },
    }, {
      initialRouteName: 'MainHome',
      transitionConfig: () => ({
        screenInterpolator: (sceneProps) => {
          // Disable the transition animation when resetting to the home screen.
          if (
            sceneProps.index === 0 &&
            sceneProps.scene.route.routeName !== 'MainHome' &&
            sceneProps.scenes.length > 2
          ) return StackViewStyleInterpolator.forHorizontal(sceneProps);
    
          // Otherwise, use the usual horizontal animation.
          if(sceneProps.scene.route.routeName === 'SearchScreen') return StackViewStyleInterpolator.forFade(sceneProps);
          return StackViewStyleInterpolator.forHorizontal(sceneProps);
        },
      }),
    });
    const MainContainer = createAppContainer(MainAppStack);
    return <MainContainer/>;
  }
}
export default MainApp;