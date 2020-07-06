import * as React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearGuestUser, clearLoginError, getUserDetails, guestUser, loginUser, loginUserFacebook, loginUserGoogle } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Button } from 'react-native-paper';


const d = Dimensions.get("window");
var user;

function getLoginRoute(user){
  if(user['profile_image_url'] == "" || 
      user['profile_image_url'] == undefined ||
      user['profile_image_url'] == null){
        return 'SignUpSelfieScreen';
  }else if((user['student_proof_image_url'] == "" || 
      user['student_proof_image_url'] == undefined ||
      user['student_proof_image_url'] == null)){
        return 'SignUpStudentProofScreen';
  }else if(user['is_instituition_email_confirmed'] == false){
    return 'SignUpStudentEmailCodeScreen';
  }else if(user['is_approved'] == false){
        return 'MainAppScreen';
  }
}

class WelcomeScreen extends React.Component {
  componentDidMount() {
    if(Platform.OS != 'ios') StatusBar.setBackgroundColor("#FF9E02");
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
  state = {

  };
  render(){
    return (
      <>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />}
      {Platform.OS === 'ios' && <StatusBar backgroundColor="transparent" barStyle="dark-content" />}
        <View style={{width: '100%', height: '100%'}}>
        <View style={{overflow: 'hidden', borderRadius: 12}}>
          <FastImage style={{height: '100%', resizeMode: 'cover'}} source={require('../assets/welcome.jpg')}>
          </FastImage>
          </View>
          <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, borderRadius: 12}}> 
          <LinearGradient
            colors={['transparent', 'transparent', 'transparent', "#00000033",  "#000000BF", "#000000BF"]}
            style={{borderRadius: 0, ...StyleSheet.absoluteFillObject}}></LinearGradient>
          </View>
          <View style={{ height: '100%', width: '100%', position: 'absolute'}}>         
           <View style={{width: '100%', alignItems: 'center', paddingTop: 42}}>
             <FastImage resizeMode="contain" source={require('../assets/elimoo-icon-welcome.png')} style={{width: 164, height: 164, backgroundColor: 'transparent'}}/>
           </View>
          </View>
          <View style={{width: "100%", position: 'absolute', bottom: 0, height: 236, padding: 16}}>
            <Text style={{fontFamily: 'NunitoSans-Black', textAlign: 'center', fontSize: 23, paddingBottom: 24, color: '#fff'}}>Welcome to Elimoo</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")}>
                  <Button labelStyle={{fontSize: 17, fontFamily: 'Nunito-Bold'}} color='#fff' uppercase={false} style={styles.main_button}>Sign Up</Button>
                </TouchableOpacity>
              <View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                <Text style={{fontFamily: 'Nunito-Bold', fontSize: 17, color: '#fff', textAlign: 'center', marginTop: 24}}>Log In</Text>
                </TouchableOpacity>
              </View>
          </View>
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
      textTransform: 'none',
    },
    forgot_password_text: {
      textAlign: "right", 
      fontSize: 16, 
      marginTop: 16, 
      marginBottom: 36, 
      color: '#FF9E02', 
      textDecorationStyle: 'solid', 
      textDecorationLine: 'underline'
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
        fontSize: 16
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
        fontSize: 16
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);