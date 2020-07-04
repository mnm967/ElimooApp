import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import md5 from 'md5';
import * as React from 'react';
import { Dimensions, Image, ScrollView, Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearLoginError, getUserDetails, loginUser, loginUserGoogle, loginUserFacebook, clearGuestUser, guestUser } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import * as Sentry from '@sentry/react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

GoogleSignin.configure({
  webClientId: '545261170400-fb3fnsvunm13043rr3noifmeck6e1vua.apps.googleusercontent.com'
});

const d = Dimensions.get("window");
var user;

function getLoginRoute(user){
  if(user['profile_image_url'] == "" || 
      user['profile_image_url'] == undefined ||
      user['profile_image_url'] == null){
        return 'SignUpSelfieScreen';
  }else if(user['instituition_name'] == "" || 
      user['instituition_name'] == undefined ||
      user['instituition_name'] == null){
        return 'SignUpInstitutionScreen';
  }else if((user['student_proof_image_url'] == "" || 
      user['student_proof_image_url'] == undefined ||
      user['student_proof_image_url'] == null) &&
      user['is_instituition_email_confirmed'] == false){
        return 'SignUpInstitutionScreen';
  }
  else if(user['is_approved'] == false){
        return 'MainAppScreen';
  }
}

class Login extends React.Component {
  componentDidMount() {
    if(Platform.OS != 'ios') ("#FF9E02");
    if(this.props.user != null){
      if(this.props.user['id'] == '--guest-user--'){
        this.props.clearGuestUser();
        return;
      }
    }
    if(this.props.login_success == true || this.props.register_success == true){
      var user = this.props.user;
      if(user['is_approved'] == true){
        var nextRoute = 'MainAppScreen';
        this.props.navigation.state.params.mainNavigation(nextRoute);
      }else{
        var nextRoute = getLoginRoute(user);
        if(nextRoute == "MainAppScreen"){
          this.props.navigation.state.params.mainNavigation(nextRoute);
          return;
        }
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: nextRoute })],
        });
        this.props.navigation.dispatch(resetAction);
      }
    }
  }

  signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      var user = userInfo.user;
      this.props.loginUserGoogle(user.givenName, user.familyName, user.email, user.id);

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.showErrorModal('Google Services Unavailable', 'Please check that Google Play Services are installed and updated on your device.', 'Try Again', this.onErrorModalTouchOutside);
      } else {
        this.showErrorModal('Something Went Wrong', 'An error occured while connecting to Google. Please Try Again.', 'Try Again', this.onErrorModalTouchOutside);
        Sentry.captureException(error);
      }
    }
  }

  _responseInfoCallback = (error, user) => {
    this.setState({facebookModalVisibility: false});
    if (error) {
      this.showErrorModal('Something Went Wrong', 'An error occured while connecting to Facebook. Please Try Again.', 'Try Again', this.onErrorModalTouchOutside);
      Sentry.captureException(error);
    } else {
      this.props.loginUserFacebook(user.first_name, user.last_name, user.email, user.id);
    }
  }
  signinFacebook = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (result) => {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              this.setState({facebookModalVisibility: true});
              const infoRequest = new GraphRequest(
                '/me',
                {
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,last_name'
                    },
                    access_token: {
                      string: data['accessToken'].toString()
                    }
                  }
                },
                this._responseInfoCallback
              );
                    
              new GraphRequestManager().addRequest(infoRequest).start();
            }
          )
        }
      },
      (error) => {
        this.showErrorModal('Something Went Wrong', 'An error occured while connecting to Facebook. Please Try Again.', 'Try Again', this.onErrorModalTouchOutside);
        Sentry.captureException(error);
      }
    );
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.login_success == true || this.props.register_success == true){
      var user = this.props.user;
      if(user['is_approved'] == true){
        var nextRoute = 'MainAppScreen';
        this.setState({}, () => this.props.navigation.state.params.mainNavigation(nextRoute));
      }else{
        var nextRoute = getLoginRoute(user);
        if(nextRoute == "MainAppScreen"){
          this.setState({}, () => this.props.navigation.state.params.mainNavigation(nextRoute));
          return;
        }
        this.setState({}, () => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: nextRoute })],
          });
          this.props.navigation.dispatch(resetAction);
        });
      }
    }else if(this.props.login_error != null){
      var error = this.props.login_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }else if(error == 'login_incorrect_data'){
        errorOutputText = ErrorPrompts.LOGIN_INCORRECT_DATA;
      }else if(error == 'facebook_email_error'){
        errorOutputText = "Your Facebook Account must have an email linked to it.";
      }

      this.showErrorModal(errorTitleText, errorOutputText, "Try Again", this.onErrorModalTouchOutside);
      this.props.clearLoginError();
    }
  }

  changePasswordVisibility = () => {
    var currentState = this.state.passwordVisibility;
    if(currentState){
      this.setState({
          passwordVisibility: false,
          passwordVisibilityIcon: 'eye-slash'
      });
    }else{
      this.setState({
          passwordVisibility: true,
          passwordVisibilityIcon: 'eye'
      });
    }
  }
  openSignUp = () => {
    this.props.navigation.navigate('SignUp', {});
  }
  onLoginClick = () => {
    Keyboard.dismiss();
    this.setState({ passwordErrorVisible: false, usernameErrorVisible: false });

    var emailCheck = false;

    var trimmedEmail = this.state.usernameText.trim();

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(trimmedEmail) === false) {
      emailCheck = false;
    }
    else {
      emailCheck = true;
    }

    if(trimmedEmail == ""){
      this.showUsernameError('Email field cannot be empty');
    }else if(this.state.passwordText == ""){
      this.showPasswordError('Password field cannot be empty');
    }else if(!emailCheck){
      this.showUsernameError('Please enter a valid email address');
    }else{
      var email = trimmedEmail.toLowerCase();
      var password = md5(this.state.passwordText);

      this.props.loginUser(email, password);
    }
  }
  showErrorModal = (title, text, buttonText, onButtonClick) => {
    this.setState({ errorModalTitle: title, 
                    errorModalText: text, 
                    onErrorButtonClick: onButtonClick,
                    errorModalButtonText: buttonText });
    this.setState({ errorModalVisibility: true });
  }
  showUsernameError = (text) => {
    this.setState({ usernameInputError: text, usernameErrorVisible: true });
  }
  showPasswordError = (text) => {
    this.setState({ passwordInputError: text, passwordErrorVisible: true });
  }
  onLoadModalTouchOutside = () => {

  }
  onErrorModalTouchOutside = () => {
    this.setState({ errorModalVisibility: false });
  }
  state = {
    usernameText: '',
    passwordText: '',
    usernameInputError: 'Email Cannot be Blank',
    passwordInputError: 'Password Cannot Be Blank',
    usernameErrorVisible: false,
    passwordErrorVisible: false,
    passwordVisibilityIcon: 'eye',
    passwordVisibility: true,
    loadModalVisibility: false,
    facebookModalVisibility: false,
    loadModalText: 'Verifying Details...',
    errorModalVisibility: false,
    errorModalTitle: 'Hello World',
    errorModalText: 'This is an Error',
    errorModalButtonText: 'Click to Hide',
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };
  loginGuest = () => {
    this.props.guestUser();
    var nextRoute = 'MainAppScreen';
    this.props.navigation.state.params.mainNavigation(nextRoute);
  }
  render(){
    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.state.facebookModalVisibility} text="Connecting to Facebook..."/>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.login_loading} text={this.state.loadModalText}/>
      <ErrorModal visible={this.state.errorModalVisibility} 
                  title={this.state.errorModalTitle} 
                  buttonText={this.state.errorModalButtonText} 
                  text={this.state.errorModalText} 
                  onTouchOutside={this.onErrorModalTouchOutside} 
                  onButtonClick={this.state.onErrorButtonClick}/>

        {Platform.OS === 'ios' && <View style={{width: '100%', height: 24, backgroundColor: 'transparent'}} />}
       {Platform.OS === 'ios' &&<StatusBar backgroundColor="transparent" barStyle="dark-content" />}
       {Platform.OS === 'android' &&<StatusBar backgroundColor="#FF9E02" barStyle="light-content" />}

        <View style={{width: '100%', height: '100%'}}>
          {false && <View style={{backgroundColor: '#FF9E02', height: 196}}>         
           <View style={{height: '100%', justifyContent: 'center'}}>
             <Image source={require('../assets/main-app-icon.png')} style={styles.app_icon}/>
           </View>
          </View>}
          <TouchableOpacity onPress={() => this.loginGuest()} style={{position: 'absolute', right: 0, zIndex: 99, paddingEnd: 32, paddingTop: 24, flex: 1}}>
            <Text style={{fontSize: 16, fontFamily: 'Nunito-Regular',}}>Skip</Text>
          </TouchableOpacity>
          <KeyboardAwareScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
          <Text style={{fontFamily: 'NunitoSans-Black', textAlign: 'center', fontSize: 23, paddingBottom: 16, marginTop: 48}}>Welcome Back!</Text>
          <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', fontSize: 20, color: "#2C2C2C", marginBottom: 24, }}>Continue with</Text>
            <View style={{flex: 2, flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
              {false && <Button labelStyle={{fontFamily: 'Nunito-SemiBold'}} onPress={() => this.signinFacebook()} style={[styles.social_button, {marginEnd: 16, marginStart: 4, backgroundColor: '#3B5998'}]} uppercase={false} mode="contained">
                Facebook
              </Button>}
              {false && <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} onPress={() => this.signInGoogle()} style={[styles.social_button, {marginStart: 16, marginEnd: 4, backgroundColor: '#4285F4'}]} uppercase={false} mode="contained">
                Google
              </Button>}
              <Button onPress={() => this.signinFacebook()} style={[styles.social_button, {marginEnd: 16, marginStart: 4, backgroundColor: '#3B5998'}]} uppercase={false} icon="facebook" mode="contained">
                Facebook
              </Button>
              <Button onPress={() => this.signInGoogle()} style={[styles.social_button, {marginStart: 16, marginEnd: 4, backgroundColor: '#fff'}]} uppercase={false} color={'#2C2C2C'} labelStyle={{height: 26}} mode="contained">
                <Image resizeMode='contain' source={require('../assets/google-image.png')} style={{height: 20, width: 20, marginEnd: 16}}/><Text style={{color: '#2C2C2C'}}>     Google</Text>
              </Button>
            </View>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', fontSize: 20, color: "#2C2C2C", marginTop: 18}}>or log in with</Text>
            <TextInput style={styles.username_input}
                placeholder='Email'
                multiline={false}
                value={this.state.usernameText}
                keyboardType={'default'}
                theme={{ colors: { text: 'white' } }}
                onChangeText={usernameText => this.setState({ usernameText })}
            />
            {this.state.usernameErrorVisible && <Text style={styles.input_error}>{this.state.usernameInputError}</Text>}
            <View style={styles.divider_line}/>
            <View style={styles.password_holder}>
              <TextInput style={styles.password_input}
                  placeholder='Password'
                  secureTextEntry={this.state.passwordVisibility}
                  theme={{ colors: { text: 'white' } }}
                  value={this.state.passwordText}
                  onChangeText={passwordText => this.setState({ passwordText })}
              />
            <TouchableOpacity onPress={this.changePasswordVisibility}>
              <Icon style={styles.text_input_icon} name={this.state.passwordVisibilityIcon} size={20} color="#bdbdbd" />
            </TouchableOpacity>
            </View>
            {this.state.passwordErrorVisible && <Text style={styles.input_error} visible>{this.state.passwordInputError}</Text>}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword', {})}>
              <Text style={styles.forgot_password_text}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{justifyContent: 'center'}}>
              <View style={{ alignSelf:'center', width: '100%'}}>
                <TouchableOpacity onPress={() => this.onLoginClick()}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold', fontSize: 17}} color='#fff' uppercase={false} style={styles.main_button}>Log In</Button>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{justifyContent: 'center', marginTop: 56}}>
              <View style={{ alignSelf:'center'}}>
                <Text style={{color: '#000', fontFamily: 'Nunito-SemiBold', fontSize: 16}}>Don't Have An Account?</Text>
                <TouchableOpacity onPress={this.openSignUp}>
                  <Text style={{fontFamily: 'Nunito-Regular', textAlign: 'center', fontSize: 16, marginTop: 8, marginBottom: 64, color: '#FF9E02'}}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
          </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
    backgroundImage: {
      position: 'absolute',
      flex: 1,
      backgroundColor:'rgba(0,0,0,0.45)',
      width: "100%",
      height: d.height+96
    },
    input_error: {
      fontWeight: 'normal', 
      fontSize: 13, color: "#f44336", 
      marginTop: 4, 
      marginStart: 4,
      textTransform: "capitalize"
    },
    social_button: {
      height: 56, 
      justifyContent: 'center', 
      flex: 1,
      borderRadius: 5,
      color: '#fff'
    },
    percent_view: {
      position: 'absolute',
      backgroundColor: '#0000004D',
      borderRadius: 7,
    },
    main_button: {
      color: '#fff',
      backgroundColor: '#FF9E02',
      height: 50,
      justifyContent: 'center',
      borderRadius: 12,
      textTransform: 'none'
    },
    forgot_password_text: {
      textAlign: "right", 
      fontSize: 16, 
      marginTop: 16, 
      marginBottom: 36, 
      color: '#FF9E02', 
      fontFamily: 'Nunito-Regular',
    },
    appbar_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    app_icon: {
      width: 213,
      height: 96, 
      alignSelf: 'center'
    }, 
    main_container: {
        flex: 1,
        backgroundColor: 'transparent',
        color: '#fff',
        paddingTop: 16,
        paddingStart: 24,
        paddingEnd: 24
    },
    headline_text: {
      color: '#fff',
      fontSize: 32,
      fontWeight: 'bold',
      marginTop: 24
    },
    username_input: {
        backgroundColor: '#fafafa',
        marginTop: 18,
        borderRadius: 10,
        borderColor: '#bdbdbd',
        borderWidth: 1,
        height: 58,
        padding: 16,
        textAlign: 'left',
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
    },
    password_input: {
        height: 56,
        paddingStart: 16,
        paddingEnd: 16,
        textAlign: 'left',
        textAlignVertical: 'center',
        color: '#000',
        alignSelf: 'stretch',
        flex: 1,
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
    },
    password_holder: {
      backgroundColor: '#fafafa',
      borderRadius: 10,
      borderColor: '#bdbdbd',
      borderWidth: 1,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16
    },
    text_input_icon: {
      paddingEnd: 8,
      paddingTop: 0,
      height: 20,
      width: 36
    },
    log_in_button: {
      alignSelf: 'center',
      padding: 4,
      borderRadius: 8,
      width: '100%'
    }
});

const mapStateToProps = state => ({
  user: state.user,
  login_loading: state.login_loading,
  login_success: state.login_success,
  login_error: state.login_error,
  register_success: state.register_success
});

const mapDispatchToProps = {
  getUserDetails,
  loginUser,
  clearLoginError,
  loginUserGoogle,
  loginUserFacebook,
  clearGuestUser,
  guestUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);