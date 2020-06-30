import * as React from 'react';
import { Dimensions, Keyboard, StatusBar, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { clearEmailUpdateError, clearEmailUpdateSuccessVar, updateUserInstituitionEmail } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const d = Dimensions.get("window");

class SignUpStudentEmailScreen extends React.Component {

  static getDerivedStateFromProps(nextProps, nextState) {
    if(nextProps.email_update_success == true){
      nextProps.clearEmailUpdateSuccessVar();
      var nextRoute = 'SignUpStudentEmailCodeScreen';
      nextProps.navigation.navigate(nextRoute, {backIsLogout: false});
    }else if(nextProps.email_update_error != null){
      var error = nextProps.email_update_error;
      var errorTitleText = 'Oh Oh! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }

      nextProps.clearEmailUpdateError();

      return {
        errorModalTitle: errorTitleText, 
        errorModalText: errorOutputText,
        errorModalVisibility: true,
        errorModalButtonText: 'Try Again' 
      }
    }

    return null;
  }

  showErrorModal = (title, text, buttonText, onButtonClick) => {
    this.setState({ errorModalTitle: title, 
                    errorModalText: text, 
                    onErrorButtonClick: onButtonClick,
                    errorModalButtonText: buttonText });
    this.setState({ errorModalVisibility: true });
  }
  onLoadModalTouchOutside = () => {
    //this.setState({ loadModalVisibility: false });
  }
  onErrorModalTouchOutside = () => {
    this.setState({ errorModalVisibility: false });
  }
  onNextClick = () => {
    Keyboard.dismiss();
    var schoolEmail = this.state.emailText.trim();
    if(schoolEmail == ""){
      this.showErrorModal('You haven\'t entered anything', 'Please Enter Your School/Instituition Email', 'Okay', () => {this.setState({ errorModalVisibility: false });});
    }else{
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var emailCheck = false;
      if (reg.test(schoolEmail) === false) {
        emailCheck = false;
      }
      else {
        emailCheck = true;
      }
      schoolEmail = schoolEmail.toLowerCase();
      
      var personalEmailCheck = false;
      if(
      //Testing : schoolEmail.endsWith('gmail.com') ||
      schoolEmail.endsWith('hotmail.com') ||
      schoolEmail.endsWith('outlook.com') ||
      schoolEmail.endsWith('live.com') ||
      schoolEmail.endsWith('msn.com') ||
      schoolEmail.endsWith('icloud.com') ||
      schoolEmail.endsWith('aol.com') ||
      schoolEmail.endsWith('yahoo.com')){
        personalEmailCheck = true;
      }

      if(!emailCheck){
        this.showErrorModal('Something Is Wrong', 'Please Enter A Valid Email Address', 'Okay', () => {this.setState({ errorModalVisibility: false });});
      }else if(personalEmailCheck){
        this.showErrorModal('Something Is Wrong', 'You cannot use your personal email here', 'Okay', () => {this.setState({ errorModalVisibility: false });});
      }else{
        var data = {
          instituition_email: schoolEmail
        }
        this.props.updateUserInstituitionEmail(this.props.user['id'], data);
      }
    }
  }
  state = {
    loadModalVisibility: false,
    loadModalText: '',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    emailText: '',
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };

  render(){
    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.email_update_loading} text="This will only take a moment..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.state.onErrorButtonClick}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
      <PaperProvider>
        <View style={{width: '100%', height: '100%', backgroundColor: '#FF9E02'}}>
          <KeyboardAwareScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
            <View style={styles.top_header}>
              <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} style={{width: '10%', zIndex: 999}}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={{fontFamily: 'NunitoSans-Black', fontSize: 26, color: '#fff', width: '75%', textAlign: 'center'}}>
                  Verify Via Email
              </Text>
              <TouchableOpacity style={{width: '15%',}}>
                <Text style={{fontSize: 13, fontFamily: 'Nunito-Regular', color: '#fff', textAlign: 'center', textDecorationLine: 'underline'}}>
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', color: '#fff', fontFamily: 'Nunito-SemiBold', fontSize: 16}}>Let us know where you study and we’ll verify your student status</Text>
            <Text style={{textAlign: 'center', color: '#fff', fontFamily: 'Nunito-Regular', fontSize: 13, marginTop:16}}>Please enter your {this.props.user['instituition_name']} email address and we'll send you a verification code</Text>
              <View style={{padding: 16, backgroundColor: '#fff', borderRadius: 8, marginTop: 48}}>
                <TextInput style={{width: '100%', borderBottomColor: '#FF9E02', borderBottomWidth: 2, color: '#000', fontFamily: 'Nunito-Regular',}}
                    placeholder='Enter Your Instituition Email'
                    theme={{ colors: { text: 'white' } }}
                    value={this.state.emailText}
                    onChangeText={emailText => this.setState({ emailText })}
                />
                <TouchableOpacity onPress={() => {this.onNextClick()}}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold', fontSize: 17}} color='#FF9E02' uppercase={false} style={styles.main_button}>Verify</Button>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', marginTop: 124, marginBottom: 72}}>
              <View style={{width: '100%', backgroundColor: '#00000040', borderRadius: 12, padding: 16, flexDirection: 'row', flex: 1}}>
                <View style={{borderWidth: 1, padding: 3, height: 24, width: 24, alignItems: 'center', borderRadius: 1000, borderColor: '#fff'}}>
                    <Icon name="info" size={16} color="#fff" />
                </View>
                <Text style={{fontSize: 14, fontFamily: 'Nunito-Regular', color: '#fff', marginStart: 12, paddingEnd: 12, width: '90%'}}>
                    Please ensure:{"\n"}{"\n"}
                    {'\u2022'} The email being used is your school Email{"\n"}
                </Text>
              </View>
            </View>
          </KeyboardAwareScrollView>
          </View>
          </PaperProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
    upload_button: {
      color: '#FFF',
      backgroundColor: 'transparent',
      borderColor: '#FFF',
      borderWidth: 2,
      justifyContent: 'center',
      borderRadius: 12,
      paddingHorizontal: 16
    },
    main_button: {
      color: '#FF9E02',
      backgroundColor: 'transparent',
      borderColor: '#FF9E02',
      borderWidth: 2,
      height: 50,
      justifyContent: 'center',
      borderRadius: 12,
      textTransform: 'none',
      marginTop: 24
    },
    sub_button: {
      color: '#FFF',
      backgroundColor: '#FF9E02',
      borderColor: '#FF9E02',
      borderWidth: 2,
      height: 50,
      justifyContent: 'center',
      borderRadius: 12,
      textTransform: 'none'
    },
    main_container: {
        flex: 1,
        backgroundColor: 'transparent',
        color: '#fff',
        paddingTop: 32,
        paddingStart: 24,
        paddingEnd: 24
    },
    top_header: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 42
    },
});

const mapStateToProps = state => ({
  user: state.user,
  email_update_loading: state.email_update_loading,
  email_update_success: state.email_update_success,
  email_update_error: state.email_update_error
});

const mapDispatchToProps = {
  clearEmailUpdateSuccessVar,
  clearEmailUpdateError,
  updateUserInstituitionEmail
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStudentEmailScreen);