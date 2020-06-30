import md5 from 'md5';
import React, { Component } from 'react';
import { Animated, BackHandler, Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal, { ModalButton, ModalContent, ModalFooter, ModalTitle, SlideAnimation } from 'react-native-modals';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const HEADER_MIN_HEIGHT = 96;
const HEADER_MAX_HEIGHT = 280;
const d = Dimensions.get("window");



class DealInStorePin extends Component
{
    constructor(props)
    {
        super(props);
        this.scrollYAnimatedValue = new Animated.Value(0);
    };
    state = {
      pin_value1: null,
      pin_value2: null,
      pin_value3: null,
      pin_value4: null,
      hiddenText: '',
      errorModalVisibility: false,
    };

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
          if(md5(finalPin) === this.props.current_deal_public_pin){
            const { navigate } = this.props.navigation;
            navigate("DealStorePassword");
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
                <Text style={{color: '#555', fontSize: 18, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginTop: 32}}>Sorry. The In-Store Pin you entered is incorrect. Please try again.</Text>
              </ModalContent>
            </Modal>

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
                            <Card onPress={() => {goBack(null); goBack(null);}} elevation={5} style={{width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, margin: 4}}>
                            <TouchableOpacity onPress={() => {goBack(null); goBack(null);}}>
                              <View style={styles.close_card}>
                                <Icon name="close" size={32} color="#FF3A3A" />
                              </View>
                            </TouchableOpacity>
                            </Card>
                      </View>
                      <View style={{width: '100%', position: 'absolute'}}>
                        <FastImage style={styles.store_icon} source={{uri: this.props.deal['store_logo_url']}}/>
                      </View>
                      <TextInput ref = {(numbers_input) => this.numbers_input = numbers_input} 
                        value={this.state.hiddenText} 
                        autoFocus={true} 
                        keyboardType='numeric'
                        style={{width: 0, height: 0}} 
                        onChangeText={hiddenText => this.changePinValue(hiddenText)}
                        onKeyPress={({ nativeEvent }) => {
                          nativeEvent.key === 'Backspace' ? this.deletePinValue() : 0;
                        }}/>
                    </View>
                      <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row'}} onPress={()=>this.numbers_input.focus()}>
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
                      </View>
                      <Text style={{marginTop: 32, fontSize: 16, textAlign: 'center', fontFamily: 'Nunito-SemiBold',}}>Enter the Elimoo In-Store Pin</Text>
                </KeyboardAwareScrollView>
                <Animated.View style = {[ styles.animatedHeader, { marginTop: Platform.OS  == 'ios' ? -20:0, height: headerHeight, backgroundColor: headerBackgroundColor } ]}>
                    <FastImage style={{height: '100%', width: '100%', resizeMode: 'cover'}} source={{uri: this.props.deal['image_url']}}>
                    </FastImage>
                    <Animated.View style={{position: 'absolute', backgroundColor: headerBackgroundColor, top: 0, right: 0, left: 0, bottom: 0}}> 
                    </Animated.View>
                    <View style={{position: 'absolute', width: d.width-32, height: '100%'}}>
                      <Card elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 42, position: 'absolute'}}> 
                        <TouchableOpacity onPress={() => { goBack();}}>
                          <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                            <Icon name="chevron-left" size={36} color="#424242" />
                          </View>
                        </TouchableOpacity>
                      </Card>
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
      fontFamily: 'NunitoSans-Black',
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
    }
});

const mapStateToProps = state => ({
  user: state.user,
  deal: state.active_deal,
  current_deal_public_pin: state.current_deal_public_pin
});
  
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DealInStorePin);