import * as React from 'react';
import { ScrollView, Dimensions, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import Modal, { ModalContent, SlideAnimation } from 'react-native-modals';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { clearForgotPasswordError, clearForgotPasswordSuccess, userForgotPassword } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';

const d = Dimensions.get("window");

class ForgotPassword extends React.Component {
  componentDidUpdate(){
    if(this.props.forgot_password_success != null && this.props.forgot_password_success != undefined){
      var success = this.props.forgot_password_success;
      var modalTitle = 'Password Successfully Changed';
      var modalText = 'You\'re password has been successfully changed';
      var modalButtonText = 'Great!';

      if(success == 'email_not_found'){
        var modalTitle = 'Email Not Found';
        var modalText = 'Sorry, the Email you entered is not linked to an Elimoo Account';
        var modalButtonText = 'Try Again';
        this.props.clearForgotPasswordSuccess();
        this.showErrorModal(modalTitle, modalText, modalButtonText, () => this.onErrorModalTouchOutside);
      }else if(success == 'email_sent'){
        this.props.clearForgotPasswordSuccess();
        this.setState({successPromptVisibility: true});
      }

    }else if(this.props.forgot_password_error != null && this.props.forgot_password_error != undefined){
      var error = this.props.forgot_password_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }
      this.props.clearForgotPasswordError();
      this.showErrorModal(errorTitleText, errorOutputText, 'Try Again', () => this.onErrorModalTouchOutside);
    }
  }
  showErrorModal = (title, text, buttonText, onButtonClick) => {
    this.setState({ errorModalTitle: title, 
                    errorModalText: text, 
                    onErrorButtonClick: onButtonClick,
                    errorModalButtonText: buttonText });
    this.setState({ errorModalVisibility: true });
  }
  onLoadModalTouchOutside = () => {  
  }
  onErrorModalTouchOutside = () => {
    this.setState({ errorModalVisibility: false });
  }
  onRequestClick = () => {
    Keyboard.dismiss();
    var email = this.state.usernameText.trim().toLowerCase();

    var emailCheck = false;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      emailCheck = false;
    }
    else {
      emailCheck = true;
    }

    if(email == ''){
      this.showErrorModal("Field is Blank", "Please input a Valid Email Address", 'Try Again', () => this.onErrorModalTouchOutside);
    }else if(!emailCheck){
      this.showErrorModal("Invalid Email Address", "Please input a Valid Email Address", 'Try Again', () => this.onErrorModalTouchOutside);
    }else{
      this.props.userForgotPassword(email);
      this.setState({usernameText: ''});
    }
  }
  state = {
    usernameText: '',
    loadModalVisibility: false,
    loadModalText: 'Processing...',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });},
    successPromptVisibility: false
  };
  hidePromptModal = () => {
    this.setState({successPromptVisibility: false});
  }

  render(){

    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.forgot_password_loading} text={this.state.loadModalText}/>
      <Modal
              visible={this.state.successPromptVisibility}
              onTouchOutside={this.onComplModalTouchOutside}    
              modalAnimation={new SlideAnimation({
                  slideFrom: 'bottom',
              })}
              rounded={true}
              modalStyle={{borderRadius: 33}}>
              <ModalContent style={{paddingTop: 56, backgroundColor: '#F5F5F5', paddingBottom: 36, width: 288, height: 356}}>
                <Image style={{width: 79, height: 72, alignSelf: 'center', marginBottom: 16}} source={require('../assets/send_icon.png')}/>
                <Text style={{color: '#000', fontSize: 18, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginTop: 32}}>Check your email to regain access to Your account via the link provided</Text>
                <TouchableOpacity onPress={() => this.hidePromptModal()} style={{marginTop: 16, width: '50%', alignSelf: 'center'}}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold', fontSize: 17}} color='#FF9E02' uppercase={false} style={styles.modal_done_button}>Done</Button>
                </TouchableOpacity>
              </ModalContent>
          </Modal>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.onErrorModalTouchOutside}/>
      
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
      <PaperProvider>
        <View style={{width: '100%', height: '100%'}}>
          <ScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
          <View style={styles.top_header}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{width: '10%', zIndex: 999}}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#000" />
                </View>
              </TouchableOpacity>
              <Text style={{fontFamily: 'Nunito-Bold', fontSize: 23, color: '#000', width: '75%', textAlign: 'center'}}>
                  Ran Into Trouble?
              </Text>
              <TouchableOpacity style={{width: '15%',}}>
                <Text style={{fontSize: 13, fontFamily: 'Nunito-Regular', color: '#000', textAlign: 'center', textDecorationLine: 'underline'}}>
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', fontSize: 15, color: "#2C2C2C", marginTop: 16}}>Enter the email address linked to your Elimoo account and we’ll help you out in no time.</Text>
            
            <TextInput style={styles.username_input}
                placeholder='Email'
                multiline={false}
                keyboardType={'default'}
                theme={{ colors: { text: 'white' } }}
                value={this.state.usernameText}
                onChangeText={usernameText => this.setState({ usernameText })}
            />
            <View style={{justifyContent: 'center', marginTop: 24}}>
              <View style={{ alignSelf:'center', width: '100%'}}>
                <TouchableOpacity onPress={() => this.onRequestClick()}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold', fontSize: 17}} color='#FFF' uppercase={false} style={styles.main_button}>Next</Button>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          </View>
          </PaperProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
    top_header: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 42
    },
    main_button: {
      color: '#FF9E02',
      backgroundColor: '#FF9E02',
      borderColor: '#FF9E02',
      height: 50,
      justifyContent: 'center',
      borderRadius: 12,
      textTransform: 'none'
    },
    modal_done_button: {
      color: '#FF9E02',
      backgroundColor: 'transparent',
      borderColor: '#FF9E02',
      borderWidth: 2,
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
        paddingTop: 32,
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
    name_input: {
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
        justifyContent: 'center', 
        flex: 1,
    },
    input_holder: {
      backgroundColor: '#fafafa',
      marginTop: 18,
      borderRadius: 10,
      borderColor: '#bdbdbd',
      borderWidth: 1,
      height: 58,
      padding: 16,
      textAlign: 'left',
      color: '#000',
      fontSize: 16,
      justifyContent: 'center', 
      flex: 1,
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
  forgot_password_success: state.forgot_password_success,
  forgot_password_error: state.forgot_password_error,
  forgot_password_loading: state.forgot_password_loading
});

const mapDispatchToProps = {
  userForgotPassword,
  clearForgotPasswordSuccess,
  clearForgotPasswordError
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);