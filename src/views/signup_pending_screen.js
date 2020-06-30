import * as React from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearPendingCheckError, clearPendingCheckSuccess, getPendingStatus, getPendingStatusBackground, resetAuthStore } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';
import FastImage from 'react-native-fast-image';


const d = Dimensions.get("window");

class SignUpPendingScreen extends React.Component {
  componentDidMount(){
    //this.props.getPendingStatusBackground(this.props.user['id']);
  }

  componentDidUpdate(){
    if(this.props.pending_check_status != null){
      var status = this.props.pending_check_status;
      if(status == "signup_approved"){
        this.setState({}, () => this.props.navigation.state.params.mainNavigation('MainAppScreen'));
      }
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if(nextState.isMount){
      nextProps.getPendingStatusBackground(nextProps.user['id']);
      return {
        isMount: false
      }
    }
    if(nextState.isCurrentCheckBackground){
      return null;
    }
    if(nextProps.pending_check_status != null){
      var status = nextProps.pending_check_status;
      if(status == "signup_approved"){
        //nextProps.navigation.state.params.mainNavigation('MainAppScreen');
      }else if(status == "signup_denied"){
        var errorTitleText = 'Access Denied';
        var errorOutputText = 'Sorry, you have been denied access to Elimoo. Try logging out and creating an account with accurate details.';

        nextProps.clearPendingCheckSuccess();

        return {
          errorModalTitle: errorTitleText, 
          errorModalText: errorOutputText,
          errorModalVisibility: true,
          errorModalButtonText: 'Okay' 
        }
      }else if(status == "signup_waiting"){
        var errorTitleText = 'Still Waiting...';
        var errorOutputText = 'Nothing New Yet. We\'ll keep you Updated!';

        nextProps.clearPendingCheckSuccess();

        return {
          errorModalTitle: errorTitleText, 
          errorModalText: errorOutputText,
          errorModalVisibility: true,
          errorModalButtonText: 'Okay' 
        }
      }
    }else if(nextProps.pending_check_error != null){
      var error = nextProps.pending_check_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }

      nextProps.clearPendingCheckError();

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
  state = {
    isCurrentCheckBackground: true,
    isMount: true,
    loadModalVisibility: false,
    loadModalText: '',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };
  onCheckPendingClick = () => {
    this.setState({ isCurrentCheckBackground: false });
    this.props.getPendingStatus(this.props.user['id']);
  }
  onContinueClick = () => {
    var nextRoute = 'MainAppScreen';
    this.props.navigation.state.params.mainNavigation(nextRoute);
  }
  onLogOutClick(){
    this.props.resetAuthStore();
    var nextRoute = "Login";
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: nextRoute })],
      });
    this.props.navigation.dispatch(resetAction);
  }

  render(){
    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.pending_check_loading} text="Checking Approval Status..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.state.onErrorButtonClick}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
        <ScrollView style={{width: '100%', height: '100%', backgroundColor: '#FF9E02'}}>
            <Text style={{fontSize: 21, marginTop: 36, color: '#fff', fontFamily: 'NunitoSans-Black', textAlign: 'center'}}>Patience, patience & patience</Text>
            <View style={styles.main_container}>
              <View>
                <FastImage style={{width: 96, height: 96, alignSelf: 'center', marginBottom: 28}} resizeMode='contain' source={require('../assets/elimoo-icon-white.png')}/>
                <FastImage style={{width: 96, height: 96, alignSelf: 'center', marginBottom: 64}} source={require('../assets/user_card_icon.png')}/>
                <Text style={{marginTop: 16, fontSize: 15, color: '#fff', fontFamily: 'Nunito-Regular', textAlign: 'center'}}>Your documentation will be reviewed within 48 hours and your account will be verified If everything checks out! Look out for a confirmation email & notification.</Text>
                <TouchableOpacity onPress={() => {this.onContinueClick()}}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} color='#FF9E02' uppercase={false} style={styles.sub_button}>Continue</Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.onCheckPendingClick()}}>
                  <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} color='#fff' uppercase={false} style={styles.logout_button}>Check Again</Button>
                </TouchableOpacity>
              </View>
            </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
    sub_button: {
      color: '#FFF',
      backgroundColor: '#FFF',
      borderColor: '#FFF',
      height: 56,
      borderRadius: 4,
      justifyContent: 'center',
      marginTop: 64
    },
    logout_button: {
      color: '#FFF',
      backgroundColor: 'transparent',
      borderColor: '#FFF',
      borderWidth: 2,
      height: 56,
      borderRadius: 4,
      justifyContent: 'center',
      marginTop: 16
    },
    main_container: {
        backgroundColor: 'transparent',
        color: '#fff',
        alignItems: 'center',
        height: d.height,
        padding: 24,
        paddingTop: 72,
    }
});

const mapStateToProps = state => ({
  user: state.user,
  pending_check_loading: state.pending_check_loading,
  pending_check_error: state.pending_check_error,
  pending_check_status: state.pending_check_status,
});

const mapDispatchToProps = {
  resetAuthStore,
  clearPendingCheckError,
  getPendingStatus,
  clearPendingCheckSuccess,
  getPendingStatusBackground
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPendingScreen);