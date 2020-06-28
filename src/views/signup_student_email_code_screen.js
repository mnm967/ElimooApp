import md5 from 'md5';
import * as React from 'react';
import { Dimensions, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearEmailVerifyError, verifyUserInstituitionEmail } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const d = Dimensions.get("window");

class SignUpStudentEmailCodeScreen extends React.Component {
  componentDidUpdate(prevProps, prevState){
    if(this.props.email_verify_success == true){
      var nextRoute = "SignUpPendingScreen";
      this.setState({}, () => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: nextRoute })],
        });
        this.props.navigation.dispatch(resetAction);
      });
    }
  }
  static getDerivedStateFromProps(nextProps, nextState) {
    if(nextProps.email_verify_success == true){
      // var nextRoute = 'SignUpPendingScreen';
      // nextProps.navigation.navigate(nextRoute, {isFirstTime: true});
    }else if(nextProps.email_verify_error != null){
      var error = nextProps.email_verify_error;
      var errorTitleText = 'Oh Oh! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }else if(error == 'pin_expired'){
        errorOutputText = "Sorry, this Pin has Expired. Please Go Back ann Enter Your Email to recieve a new Pin.";
      }else if(error == 'pin_not_found' || error == "pin_incorrect"){
        errorOutputText = "You've entered an incorrect pin. Please Try Again.";
      }

      nextProps.clearEmailVerifyError();

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
  state = {
    loadModalVisibility: false,
    loadModalText: '',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    pin_value1: null,
    pin_value2: null,
    pin_value3: null,
    pin_value4: null,
    pin_value5: null,
    pin_value6: null,
    hiddenText: '',
    onErrorButtonClick: () => {this.onErrorModalTouchOutside;}
  };

  resetPinValues = () => { 
    this.setState({pin_value1: null});
    this.setState({pin_value2: null});
    this.setState({pin_value3: null});
    this.setState({pin_value4: null});
    this.setState({pin_value5: null});
    this.setState({pin_value6: null});
  }

  deletePinValue = () => {
    if(this.state.pin_value6 != null){
      this.setState({pin_value6: null})
    }else if(this.state.pin_value5 != null){
      this.setState({pin_value5: null})
    }else if(this.state.pin_value4 != null){
      this.setState({pin_value4: null})
    }else if(this.state.pin_value3 != null){
      this.setState({pin_value3: null})
    }else if(this.state.pin_value2 != null){
      this.setState({pin_value2: null})
    }else if(this.state.pin_value1 != null){
      this.setState({pin_value1: null});
    }
  }

  onErrorModalTouchOutside = () => {
    //BackHandler.removeEventListener('hardwareBackPress', this.onErrorModalTouchOutside);
    this.setState({ errorModalVisibility: false });
    this.resetPinValues();
    this.numbers_input.focus();
    return true;
  }

  changePinValue = (text) => {
    if(this.state.pin_value1 == null){
      this.setState({pin_value1: text})
    }else if(this.state.pin_value2 == null){
      this.setState({pin_value2: text})
    }else if(this.state.pin_value3 == null){
      this.setState({pin_value3: text})
    }else if(this.state.pin_value4 == null){
      this.setState({pin_value4: text})
    }else if(this.state.pin_value5 == null){
      this.setState({pin_value5: text})
    }else if(this.state.pin_value6 == null){
      this.setState({pin_value6: text});

      var finalPin = ''+this.state.pin_value1+
      this.state.pin_value2+
      this.state.pin_value3+
      this.state.pin_value4+
      this.state.pin_value5+
      text;

      Keyboard.dismiss();

      var data = {
        encrypted_pin: md5(finalPin),
        user_id: this.props.user['id']
      }
      this.props.verifyUserInstituitionEmail(data);

      // this.setState({errorModalVisibility: true});
      // BackHandler.addEventListener('hardwareBackPress', this.onErrorModalTouchOutside);
    }
  }

  render(){
    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.email_verify_loading} text="Verifying Code..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.onErrorModalTouchOutside}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
        <View style={{width: '100%', height: '100%', backgroundColor: '#FF9E02'}}>
          <KeyboardAwareScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
            <View style={styles.top_header}>
              <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} style={{width: '10%', zIndex: 999}}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={{fontFamily: 'Nunito-Bold', fontSize: 26, color: '#fff', width: '75%', textAlign: 'center'}}>
                  Verify Via Email
              </Text>
              <TouchableOpacity style={{width: '15%',}}>
                <Text style={{fontSize: 13, fontFamily: 'Nunito-Regular', color: '#fff', textAlign: 'center', textDecorationLine: 'underline'}}>
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', color: '#fff', fontSize: 16}}>Let us know where you study and we’ll verify your student status</Text>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-Regular', color: '#fff', fontSize: 13, marginTop: 16, marginBottom: 32}}>Enter the 6-digit code sent to{'\n'}{this.props.user['instituition_email']}</Text>
            <TextInput ref = {(numbers_input) => this.numbers_input = numbers_input} 
                value={this.state.hiddenText} 
                autoFocus={true} 
                keyboardType='numeric'
                style={{width: 0, height: 0}} 
                onChangeText={hiddenText => this.changePinValue(hiddenText)}
                onKeyPress={({ nativeEvent }) => {
                  nativeEvent.key === 'Backspace' ? this.deletePinValue() : 0;
                }}/>
            <TouchableOpacity style={{alignSelf: 'center', flex: 1, flexDirection: 'row'}} onPress={()=>this.numbers_input.focus()}>
                <View style={styles.pin_holder}>
                  <Text style={styles.pin_text}>{this.state.pin_value1}</Text>
                </View>
                <View style={styles.pin_holder}>
                  <Text style={styles.pin_text}>{this.state.pin_value2}</Text>
                </View>
                <View style={styles.pin_holder}>
                  <Text style={styles.pin_text}>{this.state.pin_value3}</Text>
                </View>
                <View style={styles.pin_holder}>
                  <Text style={styles.pin_text}>{this.state.pin_value4}</Text>
                </View>
                <View style={styles.pin_holder}>
                  <Text style={styles.pin_text}>{this.state.pin_value5}</Text>
                </View>
                <View style={styles.pin_holder}>
                  <Text style={styles.pin_text}>{this.state.pin_value6}</Text>
                </View>
              </TouchableOpacity>
          </KeyboardAwareScrollView>
          </View>
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
    pin_holder: {
      backgroundColor: '#00000040', 
      borderRadius: 12, 
      width: 48, 
      height: 56, 
      marginHorizontal: 6,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pin_text: {
      color: '#FFF',
      fontFamily: 'Nunito-SemiBold',
      fontSize: 32
    },
});

const mapStateToProps = state => ({
  user: state.user,
  email_verify_loading: state.email_verify_loading,
  email_verify_success: state.email_verify_success,
  email_verify_error: state.email_verify_error
});

const mapDispatchToProps = {
  verifyUserInstituitionEmail,
  clearEmailVerifyError
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStudentEmailCodeScreen);