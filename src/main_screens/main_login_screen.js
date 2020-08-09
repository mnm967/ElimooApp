import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Login from '../views/login';
import WelcomeScreen from '../views/welcome_screen';
import SignUp from '../views/sign_up';
import SignUpSelfieScreen from '../views/signup_selfie_screen';
import SignUpInstitutionScreen from '../views/signup_institution_screen';
import SignUpStudentProofScreen from '../views/signup_student_proof_screen';
import SignUpStudentEmailScreen from '../views/signup_student_email_screen';
import SignUpStudentEmailCodeScreen from '../views/signup_student_email_code_screen';
import SignUpPendingScreen from '../views/signup_pending_screen';
import ForgotPassword from '../views/forgot_password';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import { connect } from 'react-redux';
import { stopAllLoading } from '../actions/redux_actions';
import PolicyScreen from '../views/policy_screen';

class MainLoginScreen extends React.Component{
    static getDerivedStateFromProps(nextProps, nextState) {
        nextProps.stopAllLoading();
        return null;
    }
  mainNavigation = (newRoute) => {
    const { navigate } = this.props.navigation;
    navigate(newRoute);
  }
  state = {};
  render(){
    const MainScreen = createStackNavigator({
      Login: {screen: Login, 
              navigationOptions: {
                  header: null
              }, params: {mainNavigation: this.mainNavigation}
          },
    WelcomeScreen: {screen: WelcomeScreen, 
              navigationOptions: {
                  header: null
              }, params: {mainNavigation: this.mainNavigation}
          },
      SignUp: {screen: SignUp, 
              navigationOptions: {
                  header: null
              }, params: {mainNavigation: this.mainNavigation}
          },
      SignUpSelfieScreen: {screen: SignUpSelfieScreen, 
              navigationOptions: {
                  header: null
              }
          },
      SignUpInstitutionScreen: {screen: SignUpInstitutionScreen, 
              navigationOptions: {
                  header: null
              }
          },
      SignUpStudentProofScreen: {screen: SignUpStudentProofScreen, 
              navigationOptions: {
                  header: null
              }
          },
      SignUpStudentEmailScreen: {screen: SignUpStudentEmailScreen, 
              navigationOptions: {
                  header: null
              }
          },
      SignUpStudentEmailCodeScreen: {screen: SignUpStudentEmailCodeScreen, 
              navigationOptions: {
                  header: null
              }
          },
      SignUpPendingScreen: {screen: SignUpPendingScreen, 
              navigationOptions: {
                  header: null
              }, params: {mainNavigation: this.mainNavigation}
          },
      ForgotPassword: {screen: ForgotPassword, 
              navigationOptions: {
                  header: null
              }
          },
        PolicyScreen: {screen: PolicyScreen, 
              navigationOptions: {
                  header: null
              }
          },
      }, {
        initialRouteName: 'WelcomeScreen',
        transitionConfig: getSlideFromRightTransition,
      });
    const MainContainer = createAppContainer(MainScreen);
    return <MainContainer/>;
  }
}

const mapStateToProps = state => ({});
  
const mapDispatchToProps = {
    stopAllLoading,
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLoginScreen);