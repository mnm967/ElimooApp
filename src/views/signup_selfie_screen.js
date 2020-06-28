import * as React from 'react';
import { Dimensions, Image, Platform, StatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearSelfieError, uploadProfileImage } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';


const d = Dimensions.get("window");

class SignUpSelfieScreen extends React.Component {

  componentDidUpdate(prevProps, prevState){
    if(this.props.selfie_upload_success == true){
      var nextRoute = "SignUpInstitutionScreen";
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
    if(nextProps.selfie_upload_success == true){
      // var nextRoute = 'SignUpInstitutionScreen';
      // nextProps.navigation.navigate(nextRoute, {backIsLogout: false});
    }else if(nextProps.selfie_upload_error != null){
      var error = nextProps.selfie_upload_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error' || error == 'no_file_uploaded'){
        errorOutputText = 'An unknown error occured. Please try again or use a different image.';
      }

      nextProps.clearSelfieError();

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
  onResetClick = () => {
    this.setState({chosenImage: null, imageVisible: false, imageData: null,});
  }
  openImagePicker = () => {
    ImagePicker.openPicker({
      width: 256,
      height: 256,
      cropperToolbarColor: '#ffffff',
      cropping: true
    }).then(image => {
      var src = '';
      if (Platform.OS === 'android') {
        src = { uri: image.path, isStatic: true };
      } else {
        src = { uri: image.path.replace('file://', ''), isStatic: true };
      }
      this.setState({chosenImage: src, imageData: image, imageVisible: true});
    }).catch(e => {});
  }
  openCameraPicker = () => {
    ImagePicker.openCamera({
      width: 256,
      height: 256,
      cropperToolbarColor: '#ffffff',
      cropping: true
    }).then(image => {
      var src = '';
      if (Platform.OS === 'android') {
        src = { uri: image.path, isStatic: true };
      } else {
        src = { uri: image.path.replace('file://', ''), isStatic: true };
      }
      this.setState({chosenImage: src, imageData: image, imageVisible: true});
    }).catch(e => {});
  }
  onUploadClick = () => {
    var img = this.state.imageData;
    this.props.uploadProfileImage(this.props.user['id'], img.path, img.mime);
  }
  state = {
    loadModalVisibility: false,
    loadModalText: '',
    errorModalVisibility: false,
    errorModalTitle: '',
    errorModalText: '',
    errorModalButtonText: '',
    chosenImage: null,
    imageVisible: false,
    imageData: null,
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };

  render(){
    return (
      <>
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.selfie_upload_loading} text="Uploading Your Selfie..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.state.onErrorButtonClick}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
      <PaperProvider>
        <View style={{width: '100%', height: '100%', backgroundColor: '#FF9E02'}}>
            <View style={{height: 296, width: 296, marginBottom: -128, marginEnd: -168, backgroundColor: '#fff', borderRadius: 1000, position: 'absolute',  bottom: 0, right: 0}}/>
            <View style={{height: 296, width: 296, marginBottom: -168, marginStart: -198, backgroundColor: '#fff', borderRadius: 1000, position: 'absolute',  bottom: 0, left: 0}}/>
          <ScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
            <View style={styles.top_header}>
            {false && <TouchableOpacity style={{width: '10%', zIndex: 999}}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#fff" />
                </View>
              </TouchableOpacity>}
              <Text style={{fontFamily: 'Nunito-Bold', fontSize: 26, color: '#fff', width: '85%', textAlign: 'center', paddingStart: 24}}>
                  Let's Take a Selfie
              </Text>
              <TouchableOpacity style={{width: '15%',}}>
                <Text style={{fontSize: 13, fontFamily: 'Nunito-Regular', color: '#fff', textAlign: 'center', textDecorationLine: 'underline'}}>
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', color: '#fff', fontSize: 15}}>Note this picture will be used to verify your Identity in-store and cannot be changed</Text>
            
            {this.state.imageVisible && <View style={{alignItems: 'center', marginTop: 24}}>
                <View style={{backgroundColor: '#fff', paddingVertical: 18, paddingHorizontal: 36, borderRadius: 18}}>
                <Image style={{backgroundColor: '#000', height: 256, width: 256}} source={this.state.chosenImage}>

                </Image>
              </View>
            </View>}
            {!this.state.imageVisible && <View style={{paddingTop: 96, paddingBottom: 96, alignSelf: 'center', alignItems: 'center', marginTop: 24, flexDirection: 'row', flex: 1}} >
              <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#fff', height: 96, width: 96, marginEnd: 16}} onPress={() => this.openCameraPicker()}>
                  <View style={{width: 36, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="camera" size={32} color="#FF9E02" />
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#fff', height: 96, width: 96, marginStart: 16}} onPress={() => this.openImagePicker()}>
                  <View style={{width: 36, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="image" size={32} color="#FF9E02" />
                  </View>
              </TouchableOpacity>
            </View>}
            {this.state.imageVisible && <View style={{alignItems: 'center', marginTop: 24}}>
                <View style={{flex: 2, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.onUploadClick()}>
                    <Button labelStyle={{fontFamily: 'Nunito-SemiBold',}} color='#FFF' uppercase={false} style={styles.upload_button}>Upload</Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onResetClick()}>
                        <View style={{width: 32, height: '100%', alignItems: 'center', justifyContent: 'center', marginStart: 16, transform: [{ rotateY: '180deg' }]}}>
                        <Icon name="undo" size={32} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>}
            
            <View style={{alignItems: 'center', marginTop: 24, marginBottom: 72}}>
              <View style={{width: '100%', backgroundColor: '#00000040', borderRadius: 12, padding: 16, flexDirection: 'row', flex: 1}}>
                <View style={{borderWidth: 1, padding: 3, height: 24, width: 24, alignItems: 'center', borderRadius: 1000, borderColor: '#fff'}}>
                    <Icon name="info" size={16} color="#fff" />
                </View>
                <Text style={{fontSize: 14, fontFamily: 'Nunito-Regular', color: '#fff', marginStart: 12, width: '90%'}}>
                    Please ensure:{"\n"}{"\n"}
                    {'\u2022'} You have ample lighting{"\n"}
                    {'\u2022'} Your face and eyes are visible{"\n"}
                    {'\u2022'} Only your shoulders and head are visible{"\n"}
                    {"\n"}
                    *Go for a passport style photo
                </Text>
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
    upload_button: {
      color: '#FFF',
      backgroundColor: 'transparent',
      borderColor: '#FFF',
      borderWidth: 2,
      justifyContent: 'center',
      borderRadius: 12,
      paddingHorizontal: 16
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
      marginBottom: 42,
    },
});

const mapStateToProps = state => ({
  user: state.user,
  selfie_upload_loading: state.selfie_upload_loading,
  selfie_upload_success: state.selfie_upload_success,
  selfie_upload_error: state.selfie_upload_error
});

const mapDispatchToProps = {
  uploadProfileImage,
  clearSelfieError
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpSelfieScreen);