import RNDateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import md5 from 'md5';
import * as React from 'react';
import { ScrollView, Dimensions, Image, Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Menu, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearRegisterError, registerUser, guestUser } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const d = Dimensions.get("window");

var kl1 = null;
var kl2 = null;

class SignUp extends React.Component {
  componentDidMount(){
    kl1 = Keyboard.addListener('keyboardDidShow', () => {this.setState({is_skip_visibile: false})});
    kl2 = Keyboard.addListener('keyboardDidHide', () => {this.setState({is_skip_visibile: true})});
  }
  componentWillUnmount(){
    kl1.remove();
    kl2.remove();
  }
  showErrorModal = (title, text, buttonText, onButtonClick) => {
    this.setState({ errorModalTitle: title, 
                    errorModalText: text, 
                    onErrorButtonClick: onButtonClick,
                    errorModalButtonText: buttonText });
    this.setState({ errorModalVisibility: true });
  }
  
  componentDidUpdate(prevProps, prevState){
    if(this.props.register_success == true || this.props.user != null){
      var user = this.props.user;
      if(user['is_approved'] == true){
        var nextRoute = 'MainAppScreen';
        this.setState({}, () => this.props.navigation.state.params.mainNavigation(nextRoute));
      }else{
        var nextRoute = "SignUpSelfieScreen";
        this.setState({}, () => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: nextRoute })],
          });
          this.props.navigation.dispatch(resetAction);
        });
      }
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if(nextProps.register_success == true || nextProps.user != null){
      // var nextRoute = 'SignUpSelfieScreen';
      // nextProps.navigation.navigate(nextRoute, {backIsLogout: false});
    }else if(nextProps.register_error != null){
      var error = nextProps.register_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }else if(error == 'email_exists'){
        errorOutputText = ErrorPrompts.EMAIL_EXISTS;
      }

      // this.showErrorModal(errorTitleText, errorOutputText, 'Try Again', () => {
      //   this.setState({ errorModalVisibility: false });
      // });
      nextProps.clearRegisterError();

      return {
        errorModalTitle: errorTitleText, 
        errorModalText: errorOutputText,
        errorModalVisibility: true,
        errorModalButtonText: 'Try Again' 
      }
    }

    return null;
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
  onLoadModalTouchOutside = () => {
    
  }
  onErrorModalTouchOutside = () => {
    this.setState({ errorModalVisibility: false });
  }
  onNextClick = () => {
    Keyboard.dismiss();
    this.setState({ formInputErrorVisible: false, emailErrorVisible: false, passwordErrorVisible: false });

    var emailCheck = false;

    var trimmedEmail = this.state.usernameText.trim();

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(trimmedEmail) === false) {
      emailCheck = false;
    }
    else {
      emailCheck = true;
    }

    if(this.state.firstNameText == "" || 
    this.state.lastNameText == "" ||
    this.state.gender == "" ||
    trimmedEmail == "" ||
    this.state.passwordText == "" ||
    this.state.dateOfBirth == false){
      this.showFormError('All fields need to be filled in')
    }else if(!emailCheck){
      this.showEmailError('Please enter a valid email address')
    }else if(this.state.passwordText.length < 5 || this.state.passwordText > 25){
      this.showPasswordError('Password should be between 5 - 25 characters');
    }else{
      var firstName = this.state.firstNameText.trim();
      var lastName = this.state.lastNameText.trim();

      var gender = this.state.gender;
      var email = trimmedEmail.toLowerCase();
      var password = md5(this.state.passwordText);
      var dob = this.state.chosenDateOfBirth;

      firstName = firstName.replace(/<[^>]+>/g, '');
      lastName = lastName.replace(/<[^>]+>/g, '');
      email = email.replace(/<[^>]+>/g, '');

      this.props.registerUser(firstName, lastName, email, gender, password, dob);
    }
  }

  showFormError = (text) => {
    this.setState({ formInputError: text, formInputErrorVisible: true });
  }

  showEmailError = (text) => {
    this.setState({ emailError: text, emailErrorVisible: true });
  }

  showPasswordError = (text) => {
    this.setState({ passwordError: text, passwordErrorVisible: true });
  }

  state = {
    firstNameText: '',
    lastNameText: '',
    usernameText: '',
    passwordText: '',
    gender: '',
    dateOfBirth: false,
    formInputError: 'form error',
    formInputErrorVisible: false,
    emailError: 'email error',
    emailErrorVisible: false,
    passwordError: 'password error',
    passwordErrorVisible: false,
    passwordVisibilityIcon: 'eye',
    passwordVisibility: true,
    loadModalVisibility: false,
    loadModalText: '',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    genderMenuVisible: false,
    currentGenderValue: 'Gender',
    currentGenderColor: '#9E9E9E',
    currentDOBColor: '#9E9E9E',
    showDatePicker: false,
    chosenDateOfBirth: new Date(),
    dobText: 'Date of Birth',
    is_skip_visibile: true,
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false })}
  };


  _openMenu = () => this.setState({ genderMenuVisible: true });

  _closeMenu = () => this.setState({ genderMenuVisible: false });

  openDatePicker = () => this.setState({ showDatePicker: true });

  setGender = (gender) => {
    this._closeMenu();
    this.setState({ currentGenderColor: '#000000' })
    this.setState({ currentGenderValue: gender, gender: gender })
  };

  loginGuest = () => {
    this.props.guestUser();
    var nextRoute = 'MainAppScreen';
    this.props.navigation.state.params.mainNavigation(nextRoute);
  }

  render(){
    const genderColor = this.state.currentGenderColor;
    const dobColor = this.state.currentDOBColor;
    const date = this.state.chosenDateOfBirth;
    const { goBack } = this.props.navigation;

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      this.setState({ showDatePicker: false });
      this.setState({ chosenDateOfBirth: currentDate });
      this.setState({ dateOfBirth: true });
      this.setState({ currentDOBColor: '#000000' });
      this.setState({ dobText: format(currentDate, 'yyyy/MM/dd') });
    };

    return (
      <>
      {this.state.showDatePicker && (
        <RNDateTimePicker mode="date" value={date} maximumDate={date} onChange={onChange}/>
      )}
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.register_loading} text="This Will Only Take a Second..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.state.onErrorButtonClick}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
       <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />

          {this.state.is_skip_visibile && <TouchableOpacity onPress={() => this.loginGuest()} style={{position: 'absolute', right: 0, zIndex: 999, bottom: 0, paddingEnd: 32, paddingBottom: 24, flex: 1}}>
            <Text style={{fontSize: 16, fontFamily: 'Nunito-Regular',}}>Skip</Text>
          </TouchableOpacity>}
          <PaperProvider>
        <View style={{width: '100%', height: '100%', flex: 1}}>
          
          <KeyboardAwareScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
          
            <View style={styles.top_header}>
              <TouchableOpacity onPress={() => {this.props.navigation.goBack(); if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02'); StatusBar.setBarStyle('light-content', true);}}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#424242" />
                </View>
              </TouchableOpacity>
              <Text style={{fontFamily: 'Nunito-Bold', paddingStart: 24, fontSize: 23, paddingBottom: 3}}>Let's Set Up Your Account</Text>
            </View>
          <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', fontSize: 20, color: "#2C2C2C", marginBottom: 24, marginTop: -16}}>Continue with</Text>
            <View style={{flex: 2, flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
              <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} onPress={() => this.props.navigation.navigate('Login')} style={[styles.social_button, {marginEnd: 16, marginStart: 4, backgroundColor: '#3B5998'}]} uppercase={false} mode="contained">
                Facebook
              </Button>
              <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} onPress={() => this.props.navigation.navigate('Login')} style={[styles.social_button, {marginStart: 16, marginEnd: 4, backgroundColor: '#4285F4'}]} uppercase={false} mode="contained">
                Google
              </Button>
              {false && <Button onPress={() => this.props.navigation.goBack()} style={[styles.social_button, {marginEnd: 16, marginStart: 4, backgroundColor: '#3B5998'}]} uppercase={false} icon="facebook" mode="contained">
                Facebook
              </Button>}
              {false && <Button onPress={() => this.props.navigation.goBack()} style={[styles.social_button, {marginStart: 16, marginEnd: 4, backgroundColor: '#fff'}]} uppercase={false} color={'#2C2C2C'} labelStyle={{height: 26}} mode="contained">
                <Image source={require('../assets/google-image.png')} style={{height: 20, width: 20, marginEnd: 16}}/><Text style={{color: '#2C2C2C'}}>     Google</Text>
              </Button>}
            </View>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', fontSize: 15, color: "#2C2C2C", marginTop: 18}}>or create an account</Text>
            <View style={{flex: 2, flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
              <TextInput style={[styles.name_input, {marginEnd: 8}]}
                  placeholder='First Name'
                  multiline={false}
                  keyboardType={'default'}
                  theme={{ colors: { text: 'white' } }}
                  value={this.state.firstNameText}
                  onChangeText={firstNameText => this.setState({ firstNameText })}
              />
              <TextInput style={[styles.name_input, {marginStart: 8}]}
                placeholder='Last Name'
                multiline={false}
                keyboardType={'default'}
                theme={{ colors: { text: 'white' } }}
                value={this.state.lastNameText}
                onChangeText={lastNameText => this.setState({ lastNameText })}
              />
            </View>
            <TextInput style={styles.username_input}
                placeholder='Email'
                multiline={false}
                keyboardType={'default'}
                theme={{ colors: { text: 'white' } }}
                value={this.state.usernameText}
                onChangeText={usernameText => this.setState({ usernameText })}
            />
            {this.state.emailErrorVisible && <Text style={styles.input_error} visible>{this.state.emailError}</Text>}
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
            {this.state.passwordErrorVisible && <Text style={styles.input_error} visible>{this.state.passwordError}</Text>}
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity onPress={this._openMenu} style={[styles.input_holder, {marginEnd: 8}]}>   
              <Menu
                visible={this.state.genderMenuVisible}
                onDismiss={this._closeMenu}
                anchor={
                  <View>
                      <Text style={{fontSize: 16, fontFamily: 'Nunito-Regular', color: genderColor}}>{this.state.currentGenderValue}</Text>
                  </View>
                }
              >
                <Menu.Item onPress={() => {this.setGender('Male')}} title="Male" />
                <Menu.Item onPress={() => {this.setGender('Female')}} title="Female" />
                <Menu.Item onPress={() => {this.setGender('Non-Binary')}} title="Non-Binary" />
                <Menu.Item onPress={() => {this.setGender('Other')}} title="Other" />
              </Menu>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => this.openDatePicker()} style={[styles.input_holder, {marginStart: 8}]}>   
                <View>
                  <Text style={{fontSize: 16, fontFamily: 'Nunito-Regular', color: dobColor}}>{this.state.dobText}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.formInputErrorVisible && <Text style={styles.input_error} visible>{this.state.formInputError}</Text>}
            <View style={{justifyContent: 'center', marginTop: 24}}>
              <View style={{ alignSelf:'center', width: '100%'}}>
                <TouchableOpacity onPress={() => this.onNextClick()}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold', fontSize: 17}} color='#FF9E02' uppercase={false} style={styles.main_button}>Next</Button>
                </TouchableOpacity>
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
    backgroundImage: {
      position: 'absolute',
      flex: 1,
      backgroundColor:'rgba(0,0,0,0.45)',
      width: "100%",
      height: d.height+96
    },
    social_button: {
      height: 56, 
      justifyContent: 'center', 
      flex: 1,
      borderRadius: 5,
      color: '#fff'
    },
    top_header: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 42
    },
    input_error: {
      fontWeight: 'bold', 
      fontSize: 14, 
      color: "#f44336", 
      marginTop: 4, 
      marginStart: 4,
      textTransform: "capitalize"
    },
    percent_view: {
      position: 'absolute',
      backgroundColor: '#0000004D',
      borderRadius: 7,
    },
    main_button: {
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
        fontFamily: 'Nunito-Regular',
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
  register_loading: state.register_loading,
  register_success: state.register_success,
  register_error: state.register_error
});

const mapDispatchToProps = {
  registerUser,
  clearRegisterError,
  guestUser
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);