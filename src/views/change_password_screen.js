import md5 from "md5";
import React from "react";
import { Dimensions, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { changeUserPassword, clearChangePasswordError, clearChangePasswordSuccess } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';


const d = Dimensions.get("window");
const w = d.width;

class ChangePasswordScreen extends React.Component {
  componentDidUpdate(){
    if(this.props.change_password_success != null && this.props.change_password_success != undefined){
      var success = this.props.change_password_success;
      var modalTitle = 'Password Successfully Changed';
      var modalText = 'You\'re password has been successfully changed';
      var modalButtonText = 'Great!';
      if(success == 'incorrect_current_password'){
        modalTitle = 'Incorrect Current Password';
        modalText = 'The Current Password You\'ve entered is Incorrect';
        modalButtonText = 'Try Again';
      }
      this.props.clearChangePasswordSuccess();
      this.showErrorModal(modalTitle, modalText, modalButtonText, () => this.onErrorModalTouchOutside);
    }else if(this.props.change_password_error != null && this.props.change_password_error != undefined){
      var error = this.props.change_password_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }
      this.props.clearChangePasswordError();
      this.showErrorModal(errorTitleText, errorOutputText, 'Try Again', () => this.onErrorModalTouchOutside);
    }
  }
  state = {
    usernameText: '',
    passwordText: '',
    passwordVerifyText: '',
    usernameErrorVisible: false,
    passwordErrorVisible: false,
    passwordVisibilityIcon: 'eye',
    passwordVisibility: true,
    loadModalVisibility: false,
    loadModalText: 'Changing Password...',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };
  onLoadModalTouchOutside = () => {

  }
  onErrorModalTouchOutside = () => {
    this.setState({ errorModalVisibility: false });
  }
  showErrorModal = (title, text, buttonText, onButtonClick) => {
    this.setState({ errorModalTitle: title, 
                    errorModalText: text, 
                    onErrorButtonClick: onButtonClick,
                    errorModalButtonText: buttonText });
    this.setState({ errorModalVisibility: true });
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
  changePassword = () => {
    Keyboard.dismiss();
    if(this.state.usernameText == '' || this.state.passwordVerifyText == '' || this.state.passwordText == ''){
      this.showErrorModal("Fill In All Fields", "Please fill in all fields.", "Okay", () => {this.onErrorModalTouchOutside});
    }else if(this.state.passwordText !== this.state.passwordVerifyText){
      this.showErrorModal("Passwords do not Match", "Your New Passwords do not Match. Please Try Again.", "Okay", () => this.onErrorModalTouchOutside);
    }else{
      this.props.changeUserPassword(this.props.user['id'], md5(this.state.usernameText), md5(this.state.passwordText));
    }
    this.setState({usernameText: '', passwordVerifyText: '', passwordText: ''});
  }
  render() {
    const { goBack } = this.props.navigation;
    return (
      <>
      {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.change_password_loading} text={this.state.loadModalText}/>
      <ErrorModal visible={this.state.errorModalVisibility} 
                  title={this.state.errorModalTitle} 
                  buttonText={this.state.errorModalButtonText} 
                  text={this.state.errorModalText} 
                  onTouchOutside={this.onErrorModalTouchOutside} 
                  onButtonClick={this.onErrorModalTouchOutside}/>

      <View style={styles.MainViewHolder}>
        <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>
        <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(false);
            }} />
        <View style={{flex: 1}}> 
        <View
          style={{ width: '100%'}}>
            <Card onPress={() => { goBack(null);}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 40, marginStart: 16, position: 'absolute', zIndex: 999}}>      
                <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                  <MaterialIcon name="chevron-left" size={32} color="#424242" />
                </View>
            </Card>
            <Text style={styles.category_title}>Change Password</Text>
            <View style={styles.scrollContent}> 
                <ScrollView showsHorizontalScrollIndicator={false} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    style={{flex: 1}}>
                      <TextInput style={styles.username_input}
                          placeholder='Enter Current Password'
                          value={this.state.usernameText}
                          secureTextEntry={true}
                          multiline={false}
                          keyboardType={'default'}
                          theme={{ colors: { text: 'white' } }}
                          onChangeText={usernameText => this.setState({ usernameText })}
                      />
                      <View style={styles.password_holder}>
                        <TextInput style={styles.password_input}
                            placeholder='Enter New Password'
                            secureTextEntry={this.state.passwordVisibility}
                            theme={{ colors: { text: 'white' } }}
                            value={this.state.passwordText}
                            onChangeText={passwordText => this.setState({ passwordText })}
                        />
                      <TouchableOpacity onPress={this.changePasswordVisibility}>
                        <Icon style={styles.text_input_icon} name={this.state.passwordVisibilityIcon} size={20} color="#bdbdbd" />
                      </TouchableOpacity>
                      </View>
                      <TextInput style={styles.username_input}
                          placeholder='Verify New Password'
                          value={this.state.passwordVerifyText}
                          secureTextEntry={true}
                          multiline={false}
                          keyboardType={'default'}
                          theme={{ colors: { text: 'white' } }}
                          onChangeText={passwordVerifyText => this.setState({ passwordVerifyText })}
                      />
                      <View style={{justifyContent: 'center', marginTop: 24}}>
                        <View style={{ alignSelf:'center', width: '100%'}}>
                          <TouchableOpacity onPress={() => this.changePassword()}>
                            <Button labelStyle={{textTransform: 'none', fontSize: 17, fontFamily: 'Nunito-SemiBold',}} color='#fff' uppercase={false} style={styles.main_button}>Change Password</Button>
                          </TouchableOpacity>
                        </View>
                      </View>
                </ScrollView>
            </View>
        </View>
        </View>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  MainViewHolder: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff"
  },
  ViewHolder: {
    padding: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    minHeight: d.height,
  },
  setting_item: {
    height: 36,
    width: "100%",
    paddingTop: 32,
    paddingBottom: 32,
    paddingStart: 16,
    paddingEnd: 8,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderColor: '#f6f6f6',
    borderWidth: 2
  },
  setting_text_holder: {
    height: '100%',
    width: '85%',
    justifyContent: 'center',
  },
  setting_text: {
    fontSize: 18,
    fontWeight: 'normal'
  },
  setting_icon_holder: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  category_title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    paddingTop: 32,
    paddingBottom: 16,
    paddingStart: 78
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
  main_button: {
    color: '#fff',
    backgroundColor: '#FF9E02',
    height: 56,
    justifyContent: 'center',
    borderRadius: 12,
    textTransform: 'none'
  },
});
const mapStateToProps = state => ({
  user: state.user,
  change_password_success: state.change_password_success,
  change_password_error: state.change_password_error,
  change_password_loading: state.change_password_loading
});

const mapDispatchToProps = {
  changeUserPassword,
  clearChangePasswordSuccess,
  clearChangePasswordError
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);