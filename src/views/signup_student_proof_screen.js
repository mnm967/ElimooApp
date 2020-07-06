import * as React from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearProofError, uploadStudentProofImage } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import ErrorModal from '../modals/error_modal';
import LoadingModal from '../modals/loading_modal';



const d = Dimensions.get("window");

class SignUpStudentProofScreen extends React.Component {
  componentDidUpdate(prevProps, prevState){
    if(this.props.proof_upload_success == true){
      var nextRoute = "SignUpStudentEmailCodeScreen";
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
    if(nextProps.proof_upload_success == true){
      // var nextRoute = 'SignUpPendingScreen';
      // nextProps.navigation.navigate(nextRoute, {isFirstTime: true});
    }else if(nextProps.proof_upload_error != null){
      var error = nextProps.proof_upload_error;
      var errorTitleText = 'Oh No! Something Went Wrong';
      var errorOutputText = '';

      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error' || error == 'no_file_uploaded'){
        errorOutputText = 'An unknown error occured. Please try again or use a different image.';
      }

      nextProps.clearProofError();

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
  openImagePicker = () => {
    ImagePicker.openPicker({
      cropperToolbarColor: '#ffffff',
      cropping: true
    }).then(image => {
      var src = '';
      if (Platform.OS === 'android') {
        src = { uri: image.path, isStatic: true };
      } else {
        src = { uri: image.path.replace('file://', ''), isStatic: true };
      }
      var h = image.height/(image.width/256);
      this.setState({chosenImage: src, imageData: image, imageVisible: true, imageHeight: h});
    }).catch(e => {});
  }
  openCameraPicker = () => {
    ImagePicker.openCamera({
      cropperToolbarColor: '#ffffff',
      cropping: true,
      compressImageMaxWidth: 856,
      compressImageMaxHeight: 856,
    }).then(image => {
      var src = '';
      if (Platform.OS === 'android') {
        src = { uri: image.path, isStatic: true };
      } else {
        src = { uri: image.path.replace('file://', ''), isStatic: true };
      }
      var h = image.height/(image.width/256);
      this.setState({chosenImage: src, imageData: image, imageVisible: true, imageHeight: h});
    }).catch(e => {});
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
    imageHeight: 0,
    onErrorButtonClick: () => {this.setState({ errorModalVisibility: false });}
  };
  onUploadClick = () => {
    var img = this.state.imageData;
    this.props.uploadStudentProofImage(this.props.user['id'], img.path, img.mime);
  }
  onResetClick = () => {
    this.setState({chosenImage: null, imageVisible: false, imageData: null,});
  }

  render(){
    const imgHeight = this.state.imageHeight;

    return (
      <>
      
      <LoadingModal onTouchOutside={this.onLoadModalTouchOutside} visible={this.props.proof_upload_loading} text="Uploading ID..."/>
       <ErrorModal visible={this.state.errorModalVisibility} title={this.state.errorModalTitle} buttonText={this.state.errorModalButtonText} text={this.state.errorModalText} onTouchOutside={this.onErrorModalTouchOutside} onButtonClick={this.state.onErrorButtonClick}/>
       {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
      <PaperProvider>
        <View style={{width: '100%', height: '100%', backgroundColor: '#FF9E02'}}>
            <View style={{height: 296, width: 296, marginBottom: -128, marginEnd: -168, backgroundColor: '#fff', borderRadius: 1000, position: 'absolute',  bottom: 0, right: 0}}/>
            <View style={{height: 296, width: 296, marginBottom: -168, marginStart: -198, backgroundColor: '#fff', borderRadius: 1000, position: 'absolute',  bottom: 0, left: 0}}/>
          <ScrollView style={styles.main_container} keyboardShouldPersistTaps="always">
            <View style={styles.top_header}>
            {false && <TouchableOpacity style={{width: '10%', zIndex: 999, backgroundColor: 'transparent'}} onPress={() => this.props.navigation.goBack()}>
                <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="chevron-left" size={24} color="#fff" />
                </View>
              </TouchableOpacity>}
              <Text style={{fontFamily: 'NunitoSans-Black', fontSize: 26, color: '#fff', width: '85%', textAlign: 'center'}}>
                Let’s see some ID
              </Text>
              <TouchableOpacity style={{width: '15%',}}>
                <Text style={{fontSize: 13, fontFamily: 'Nunito-Regular', color: '#fff', textAlign: 'center', textDecorationLine: 'underline'}}>
                  Help
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-SemiBold', color: '#fff', fontSize: 16}}>This is our way of protecting you and our partners</Text>
            <Text style={{textAlign: 'center', fontFamily: 'Nunito-Regular', color: '#fff', fontSize: 13, marginTop:16}}>Your ID will never be shared with our partners or anyone who uses Elimoo</Text>
            
            {this.state.imageVisible && <View style={{alignItems: 'center', marginTop: 24}}>
                <View style={{backgroundColor: '#fff', paddingVertical: 18, paddingHorizontal: 36, borderRadius: 18}}>
                <Image style={{backgroundColor: '#000', height: imgHeight, width: 256, resizeMode: 'contain'}} source={this.state.chosenImage}>

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
                    You may add the following Government issued ID:{"\n"}{"\n"}
                    {'\u2022'} Omang (ID){"\n"}
                    {'\u2022'} Driver’s Licence{"\n"}
                    {'\u2022'} Passport{"\n"}{"\n"}

                    Hint: Your ID needs to be an official government- Issued ID (not an ID for a school, library, gym, etc.) that includes a photo of you.
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
      marginBottom: 42
    },
});

const mapStateToProps = state => ({
  user: state.user,
  proof_upload_loading: state.proof_upload_loading,
  proof_upload_success: state.proof_upload_success,
  proof_upload_error: state.proof_upload_error
});

const mapDispatchToProps = {
  uploadStudentProofImage,
  clearProofError
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStudentProofScreen);