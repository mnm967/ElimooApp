import md5 from 'md5';
import React, { Component } from 'react';
import { Animated, BackHandler, Dimensions, Keyboard, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal, { ModalButton, ModalContent, ModalFooter, ModalTitle, SlideAnimation } from 'react-native-modals';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { clearRedeemDealError, clearRedeemDealSuccess, redeemDeal } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import LoadingModal from '../modals/loading_modal';
import DropDownHolder from '../util/DropDownHandler';
import { format } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const HEADER_MIN_HEIGHT = 96;
const HEADER_MAX_HEIGHT = 280;
const d = Dimensions.get("window");

var myInterval;
class DealStorePassword extends Component
{
    constructor(props)
    {
        super(props);
        this.scrollYAnimatedValue = new Animated.Value(0);
    };
    componentDidUpdate(){
      if(this.props.redeem_deal_success != null){
        if(this.props.redeem_deal_success == "usage_limit_reached"){
          this.props.navigation.navigate('DealUsageLimitView');
        }if(this.props.redeem_deal_success == "deal_unavailable"){
          DropDownHolder.showDropdown('error', "Deal Unavailable", "Sorry, this Deal is currently Unavailable. Please Check Again Later.");
        }if(this.props.redeem_deal_success == "deal_redeem_success"){
          this.props.navigation.navigate('DealCompleteView');
        }
        this.props.clearRedeemDealSuccess();
      }else if(this.props.redeem_deal_error != null){
        var error = this.props.redeem_deal_error;
        var errorOutputText = "";
        if(error == 'network_error'){
          errorOutputText = ErrorPrompts.NETWORK_ERROR;
        }else if(error == 'unknown_error'){
          errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
        }
        DropDownHolder.showDropdown('error', "Something Went Wrong", errorOutputText);
        this.props.clearRedeemDealError();
      }
    }
    resetStack = () => {
      this.props.navigation.dispatch(StackActions.popToTop());
      //BackHandler.removeEventListener('hardwareBackPress', this.click_func);
    }
    state = {
      pin_value1: null,
      pin_value2: null,
      pin_value3: null,
      pin_value4: null,
      hiddenText: '',
      errorModalVisibility: false,

      expiryDate: 'N/A',
      first_name: this.props.user['first_name'],
      time: format(new Date(), 'kk:mm:ss'),
      imageURI: {uri: this.props.user['profile_image_url']},
      accountModalVisible: false
    };

    showAccountModal = () =>{
      this.setState({time: format(new Date(), 'kk:mm:ss')});
      this.setState({accountModalVisible: true});
      myInterval = setInterval(() => {this.setState({time: format(new Date(), 'kk:mm:ss')})}, 1000);
    }
    hideAccountModal = () =>{
      this.setState({accountModalVisible: false});
      clearInterval(myInterval);
    }

    changePinValue = (text) => {
      if(this.state.pin_value1 == null){
        this.setState({pin_value1: text})
      }else if(this.state.pin_value2 == null){
        this.setState({pin_value2: text})
      }else if(this.state.pin_value3 == null){
        this.setState({pin_value3: text})
      }else if(this.state.pin_value4 == null){
        this.setState({pin_value4: text});

        var finalPin = ''+this.state.pin_value1+
        this.state.pin_value2+
        this.state.pin_value3+
        text;

        var t = () => {
          myListener.remove();
          if(md5(finalPin) === this.props.current_deal_private_pin){
            const { navigate } = this.props.navigation;
            this.props.redeemDeal(this.props.user['id'], this.props.deal['id']);
          }else{
            this.setState({errorModalVisibility: true});
            BackHandler.addEventListener('hardwareBackPress', this.onErrorModalTouchOutside);
          }
        }
        var myListener = Keyboard.addListener("keyboardDidHide", t);
        Keyboard.dismiss();
      }
    }

    resetPinValues = () => { 
      this.setState({pin_value1: null});
      this.setState({pin_value2: null});
      this.setState({pin_value3: null});
      this.setState({pin_value4: null});
    }

    deletePinValue = () => {
      if(this.state.pin_value4 != null){
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
      BackHandler.removeEventListener('hardwareBackPress', this.onErrorModalTouchOutside);
      this.setState({ errorModalVisibility: false });
      this.resetPinValues();
      this.numbers_input.focus();
      return true;
    }

    render()
    {
        const headerHeight = this.scrollYAnimatedValue.interpolate(
        {
            inputRange: [ 0, ( HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT ) ],
            outputRange: [ HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT ],
            extrapolate: 'clamp'
        });

        const headerBackgroundColor = this.scrollYAnimatedValue.interpolate(
        {
            inputRange: [ 0, ( HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT )  ],
            outputRange: [ '#00000033', '#FF9E02' ],
            extrapolate: 'clamp'
        });

        const { navigate } = this.props.navigation;
        const { goBack } = this.props.navigation;

        return(
          <>
          <LoadingModal onTouchOutside={() => {}} visible={this.props.redeem_deal_loading} text="Processing..."/>
            <Modal
              visible={this.state.errorModalVisibility}
              onTouchOutside={this.onErrorModalTouchOutside}
              footer={
                <ModalFooter>
                  <ModalButton
                    text="Try Again"
                    textStyle={{fontSize: 13, fontFamily: 'Nunito-SemiBold', color: '#FF9E02'}}
                    onPress={this.onErrorModalTouchOutside}
                  />
                </ModalFooter>
              }
              modalTitle={<ModalTitle textStyle={{fontFamily: 'Nunito-Bold',}} title="Wrong Pin Entered" />}
              modalAnimation={new SlideAnimation({
                slideFrom: 'left',
              })}
            >
              <ModalContent style={{paddingStart: 64, paddingEnd: 64, width: 356}}>
                <Text style={{color: '#555', fontSize: 18, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginTop: 32}}>Sorry. The Employee Pin you entered is incorrect. Please try again.</Text>
              </ModalContent>
            </Modal>

            {this.props.user['id'] != '--guest-user--' && <Modal
            visible={this.state.accountModalVisible}
            rounded={true}
            modalStyle={{borderRadius: 33}}
            onTouchOutside={() => {this.hideAccountModal()}}    
            modalAnimation={new SlideAnimation({
                slideFrom: 'bottom',
            })}>
            <ModalContent style={{paddingTop: 0, paddingBottom: 0, width: 356}}>
            <View style={styles.main_container}>
              <View style={styles.main_holder}>
                <Card onPress={() => { this.hideAccountModal()}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 0, marginEnd: -20, position: 'absolute', zIndex: 999, right: 0}}>
                    <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                      <Icon name="close" size={32} color="#424242" />
                    </View>
                </Card>
                <FastImage source={require('../assets/elimoo-id-image.png')} resizeMode="contain" style={{height: 56, backgroundColor: 'transparent'}}/>
                <FastImage source={this.state.imageURI} style={styles.profile_icon} />
                <Text style={styles.subtitle_text} >{this.props.user['first_name']+" "+this.props.user['last_name']}</Text>
                <Text style={styles.subtitle_text_grey}>Instituition</Text>
                <Text style={styles.main_text_detail}>{this.props.user['instituition_name']}</Text>
                <Text style={styles.subtitle_text_grey}>Expires</Text>
                <Text style={styles.main_text_detail}>{(this.props.user['expiry_date'] == null 
                                                        || this.props.user['expiry_date'] == undefined) ?
                                                        'N/A' : format(this.props.user['expiry_date'], 'yyyy/MM/dd') }</Text>
                <View style={styles.bottom}>
                  <Text style={styles.mini_text_orange}>{format(new Date(), 'yyyy/MM/dd')}</Text>
                  <Text style={styles.mini_main_text_detail}>{this.state.time}</Text>
                </View>
              </View>
            </View>
            </ModalContent>
        </Modal>}

            <StatusBar translucent barStyle="light-content" backgroundColor="transparent"/>
            <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('transparent');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(true);
            }} />
            <View style = { styles.container }>
            <KeyboardAvoidingView behavior='position'>
                <KeyboardAwareScrollView
                    contentContainerStyle = {{ paddingTop: HEADER_MAX_HEIGHT }}
                    scrollEventThrottle = { 16 }
                    onScroll = { Animated.event(
                      [{ nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue }}}]
                )}>
                    <View style={styles.top_view_holder}>
                      <View style={{width: '100%', zIndex: 1000, position: 'absolute'}}>
                        <TouchableOpacity onPress={() => {goBack(null); goBack(null);}}>
                            <Card elevation={5} style={{width: 48, height: 48, borderRadius: 1000, margin: 4}}>
                              <View style={styles.close_card}>
                                <Icon name="close" size={32} color="#FF3A3A" />
                              </View>
                            </Card>
                            </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.showAccountModal()}} style={{position: 'absolute', right: 0, marginEnd: 16}}>
                            <Card elevation={5} style={{width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, margin: 4}}>
                              <View style={styles.close_card}>
                                <Icon name="account-card-details-outline" size={28} color="#FF9E02" />
                              </View>
                            </Card>
                        </TouchableOpacity>
                      </View>
                      <View style={{width: '100%', position: 'absolute'}}>
                        <FastImage style={styles.store_icon} source={{uri: this.props.deal['store_logo_url']}}/>
                      </View>
                    </View>
                    <View style={{padding: 12}}>
                      <TouchableOpacity style={{alignSelf: 'center', flex: 1, flexDirection: 'row'}} onPress={()=>this.numbers_input.focus()}>
                      <TextInput ref = {(numbers_input) => this.numbers_input = numbers_input} 
                        value={this.state.hiddenText} 
                        autoFocus={true} 
                        keyboardType='numeric'
                        style={{width: 0, height: 0}} 
                        onChangeText={hiddenText => this.changePinValue(hiddenText)}
                        onKeyPress={({ nativeEvent }) => {
                          nativeEvent.key === 'Backspace' ? this.deletePinValue() : 0;
                        }}/>
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
                      </TouchableOpacity>
                      <Text style={{marginTop: 24, fontSize: 16, textAlign: 'center', color: '#FF9E02', fontFamily: 'Nunito-Bold',}}>Hand Over Your Phone to an Employee</Text>
                      <Text style={{marginTop: 2, fontSize: 16, textAlign: 'center', fontFamily: 'Nunito-SemiBold',}}>Enter Store Password</Text>
                    </View>
                </KeyboardAwareScrollView>
                <Animated.View style = {[ styles.animatedHeader, {marginTop: -20, height: headerHeight, backgroundColor: headerBackgroundColor } ]}>
                    <FastImage style={{height: '100%', width: '100%', resizeMode: 'cover'}} source={{uri: this.props.deal['image_url']}}>
                    </FastImage>
                    <Animated.View style={{position: 'absolute', backgroundColor: headerBackgroundColor, top: 0, right: 0, left: 0, bottom: 0}}> 
                    </Animated.View>
                    <View style={{position: 'absolute', width: d.width-32, height: '100%'}}>
                    <TouchableOpacity onPress={() => { goBack(null); goBack(null);}}>
                      <Card elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 42, position: 'absolute'}}>
                        
                          <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                            <Icon name="chevron-left" size={36} color="#424242" />
                          </View>
                      </Card>
                        </TouchableOpacity>
                      {this.props.deal['deal_type'] == "Percentage Discount" && <View style={styles.percent_view}>
                    <Text style={{color: '#fff', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>{this.props.deal['percentage']}%</Text>
                        </View>}
                        {this.props.deal['deal_type'] == "Value" && <View style={styles.percent_view}>
                    <Text style={{color: '#fff', fontFamily: 'Nunito-Bold', textAlign: 'center'}}>DEAL</Text>
                        </View>}
                    </View>
                </Animated.View>
                </KeyboardAvoidingView>
            </View>
            </>
        );
    }
}

const styles = StyleSheet.create(
{
    container:{
        flex: 1,
        paddingTop: (Platform.OS == 'ios') ? 20 : 0
    },

    deal_title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center'
    },

    deal_prompt: {
      marginTop: 4,
      color: '#BDBDBD',
       fontWeight: 'bold'
    },

    deal_button: {
      color: '#fff',
      backgroundColor: '#FF9E02',
      height: 56,
      justifyContent: 'center'
    },
    percent_view: {
      position: 'absolute',
      marginTop: 42,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignSelf: 'flex-end',
      backgroundColor: '#0000004D',
      marginRight: 16,
      borderRadius: 7,
    },
    /*deal_prompt_view: {
      position: 'absolute',
      marginTop: 42,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignSelf: 'flex-end',
      backgroundColor: '#e539354D',
      marginRight: 16,
      borderRadius: 7
    },*/
    pin_holder: {
      backgroundColor: '#EAEAEA', 
      borderRadius: 12, 
      width: 48, 
      height: 56, 
      marginHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pin_text: {
      color: '#FF9E02',
      fontFamily: 'Nunito-SemiBold',
      fontSize: 32
    },
    animatedHeader:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    top_view_holder: {
      height: 96, 
      marginBottom: 16, 
      marginStart: 16, 
      padding: 8,
      justifyContent: 'center', 
      alignItems: 'center', 
      borderBottomColor: '#BDBDBD4D', 
      borderBottomWidth: 1, 
      flexDirection: 'row'
    },
    close_card: {
      width: 48, 
      height: 48, 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: 1000
    },
    store_icon: {
      zIndex: 8, 
      resizeMode: 'cover', 
      width: 84, 
      height: 84, 
      alignSelf:'center'
    },

    headerText: {
        color: 'white',
        fontSize: 22
    },

    item:{
        backgroundColor: '#E0E0E0',
        margin: 8,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },

    itemText:{
        color: 'black',
        fontSize: 16
    },

    main_container: {
      backgroundColor: 'transparent',
  },
  bottom: {
    
  },
  main_holder: {
    marginTop: 24,
    marginStart: 24,
    marginEnd: 24,
    padding: 24,
  },
  headline_text: {
    color: '#000',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center'
  },
  title_view: {
    flexDirection: 'row',
    flex: 2,
    marginTop: 36,
    justifyContent: 'center'
  },
  title_text: {
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    textAlign: 'center'
  },
  main_text_detail: {
    color: '#000',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  mini_main_text_detail: {
    color: '#000',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle_text: {
    color: '#000',
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 36,
  },
  subtitle_text_grey: {
    color: '#bdbdbd',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 36,
  },
  mini_text_orange: {
    color: '#FF9E02',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 36,
    textTransform: 'uppercase',
  },
  title_icon: {
    width: 32,
    height: 32,
    alignSelf: 'center'
  },
  profile_icon: {
    marginTop: 36,
    alignSelf: 'center',
    height: 172,
    width: 172,
    borderWidth: 1,
    borderRadius: 16
  },
  log_in_button: {
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 9,
    borderRadius: 5,
    marginBottom: 36,
    width: 156
  }
});
const mapStateToProps = state => ({
  user: state.user,
  deal: state.active_deal,
  current_deal_private_pin: state.current_deal_private_pin,
  redeem_deal_loading: state.redeem_deal_loading,
  redeem_deal_success: state.redeem_deal_success,
  redeem_deal_error: state.redeem_deal_error,
});
  
const mapDispatchToProps = {
  redeemDeal, 
  clearRedeemDealError, 
  clearRedeemDealSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(DealStorePassword);