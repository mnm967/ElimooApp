import * as React from 'react';
import { Dimensions, Keyboard, StatusBar, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { clearUpdateError, clearUpdateSuccessVar, updateUserDetails } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const d = Dimensions.get("window");

class SignUpInstitutionScreen extends React.Component {
  static getDerivedStateFromProps(nextProps, nextState) {
    if(nextProps.update_success == true){
      nextProps.clearUpdateSuccessVar();
      var nextRoute = nextState.pendingScreenChange;
      nextProps.navigation.navigate(nextRoute, {backIsLogout: false});
    }else if(nextProps.update_error != null){
      var error = nextProps.update_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = 'An unknown error occured. Please Try Again.';
      }

      nextProps.clearUpdateError();

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
  onNextClick = (screen) => {
    Keyboard.dismiss();
    var schoolText = this.state.instituitionText.trim();
    if(schoolText == ""){
      this.showErrorModal('You haven\'t entered anything', 'Please Enter Your School/Instituition', 'Okay', () => {this.setState({ errorModalVisibility: false });});
    }else{
      var data = {
        instituition_name: schoolText
      }
      this.setState({ pendingScreenChange: screen });
      this.props.updateUserDetails(this.props.user['id'], data);
    }
  }
  state = {
    loadModalVisibility: false,
    loadModalText: '',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    instituitionText: '',
    pendingScreenChange: 'SignUpStudentProofScreen',
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };

  render(){
    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.update_loading} text="This will only take a moment..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.state.onErrorButtonClick}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
      <PaperProvider>
        <View style={{width: '100%', height: '100%', backgroundColor: '#FF9E02'}}>
            <View style={{height: 296, width: 296, marginBottom: -168, marginStart: -148, backgroundColor: '#fff', borderRadius: 1000, position: 'absolute',  bottom: 0, left: 0}}/>
          <KeyboardAwareScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
            <View style={styles.top_header}>
              {false && <TouchableOpacity style={{width: '10%', zIndex: 999}}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#fff" />
                </View>
              </TouchableOpacity>}
              <Text style={{fontFamily: 'NunitoSans-Black', fontSize: 26, color: '#fff', width: '85%', textAlign: 'center', paddingStart: 8}}>
                  Where do you Study?
              </Text>
              <TouchableOpacity style={{width: '15%',}}>
                <Text style={{fontSize: 13, fontFamily: 'Nunito-Regular', color: '#fff', textAlign: 'center', textDecorationLine: 'underline'}}>
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', color: '#fff', fontFamily: 'Nunito-SemiBold', fontSize: 15}}>Let us know where you study and we’ll verify your student status</Text>
            <TextInput style={{marginTop: 96, width: '100%', borderBottomColor: '#fff', borderBottomWidth: 2, color: '#fff', fontFamily: 'Nunito-Regular',}}
                  placeholder='Enter Your School/Instituition'
                  theme={{ colors: { text: 'white' } }}
                  value={this.state.instituitionText}
                  onChangeText={instituitionText => this.setState({ instituitionText })}
              />
              <View style={{padding: 16, backgroundColor: '#fff', borderRadius: 8, marginTop: 36}}>
                <TouchableOpacity onPress={() => {this.onNextClick('SignUpStudentProofScreen')}}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} color='#FFFFFF' uppercase={false} style={styles.sub_button}>Upload Proof</Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.onNextClick('SignUpStudentEmailScreen')}}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} color='#FF9E02' uppercase={false} style={styles.main_button}>Via Email</Button>
                </TouchableOpacity>
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
  update_loading: state.update_loading,
  update_success: state.update_success,
  update_error: state.update_error
});

const mapDispatchToProps = {
  clearUpdateSuccessVar,
  clearUpdateError,
  updateUserDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpInstitutionScreen);