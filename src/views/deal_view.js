import React, { Component } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { checkDealAvailability, clearCheckAvailabilityError, clearCheckAvailabilitySuccess } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import LoadingModal from '../modals/loading_modal';
import DropDownHolder from '../util/DropDownHandler';

const HEADER_MIN_HEIGHT = 96;
const HEADER_MAX_HEIGHT = 280;
const d = Dimensions.get("window");

class DealView extends Component
{
    constructor(props)
    {
        super(props);
        this.scrollYAnimatedValue = new Animated.Value(0);
    };
    componentDidMount(){
      if(Platform.OS != 'ios') StatusBar.setBackgroundColor('transparent');
      if(Platform.OS != 'ios') StatusBar.setTranslucent(true);
    }
    componentDidUpdate(){
      if(this.props.check_availability_success != null){
        if(this.props.check_availability_success == "usage_limit_reached"){
          if(this.props.navigation.state.params.avoidReset == true){
            this.props.navigation.navigate('DealUsageLimitView', {avoidReset: true});
          }else{
            this.props.navigation.navigate('DealUsageLimitView');
          }     
        }else if(this.props.check_availability_success == "deal_unavailable"){
          DropDownHolder.showDropdown('error', "Deal Unavailable", "Sorry, this Deal is currently Unavailable. Please Check Again Later.");
        }else if(this.props.check_availability_success == "deal_available"){
          this.props.navigation.navigate('DealRedeem');
        }else if(this.props.check_availability_success == "account_not_approved"){
          DropDownHolder.showDropdown('error', "Account Not Approved", "Sorry, your account has not been approved yet. We'll let you know once your account has been approved.  Please Try Again Later.");
        }
        this.props.clearCheckAvailabilitySuccess();
      }else if(this.props.check_availability_error != null){
        var error = this.props.check_availability_error;
        var errorOutputText = "";
        if(error == 'network_error'){
          errorOutputText = ErrorPrompts.NETWORK_ERROR;
        }else if(error == 'unknown_error'){
          errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
        }
        DropDownHolder.showDropdown('error', "Something Went Wrong", errorOutputText);
        this.props.clearCheckAvailabilityError();
      }
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
            <LoadingModal onTouchOutside={() => {}} visible={this.props.check_availability_loading} text="Checking Availability..."/>
             <StatusBar translucent barStyle="light-content" backgroundColor="transparent"/>
             <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('transparent');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(true);
            }} />
            <View style = { styles.container }>
                <ScrollView 
                    contentContainerStyle = {{ paddingTop: HEADER_MAX_HEIGHT }}
                    scrollEventThrottle = { 16 }
                    onScroll = { Animated.event(
                      [{ nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue }}}]
                )}>
                    <View style={{ height: 96, marginBottom: 16, padding: 4, justifyContent:'center', alignItems: 'center', borderBottomColor: '#BDBDBD4D', borderBottomWidth: 1}}>
                      <FastImage style={{zIndex: 8, resizeMode: 'cover', width: 84, height: 84}} source={{uri: this.props.deal['store_logo_url']}}/>
                    </View>
                    <View style={{padding: 16}}>
                    <Text style={styles.deal_title}>{this.props.deal['store_name']}</Text>
                      {this.props.deal['available_online'] && <Text style={styles.deal_prompt}>Available Online</Text>}
                      <Text style={{marginTop: 32, fontSize: 16, fontFamily: 'Nunito-Bold',}}>The Deal:</Text>
                      <Text style={{marginTop: 24, marginBottom: 32, fontSize: 16, fontFamily: 'Nunito-SemiBold',}}>{this.props.deal['description']}</Text>
                      {this.props.user['id'] != '--guest-user--' && <TouchableOpacity onPress={() => this.props.checkDealAvailability(this.props.user['id'], this.props.deal['id'])}><Button labelStyle={{textTransform: 'none', fontSize: 17, fontFamily: 'Nunito-SemiBold',}} color='#fff' style={styles.deal_button}>Get Discount</Button></TouchableOpacity>}
                      {this.props.user['id'] === '--guest-user--' && <TouchableOpacity onPress={() => {
                        if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02');
                        if(Platform.OS != 'ios') StatusBar.setTranslucent(false);
                        this.props.navigation.state.params.mainNavigation('MainLoginScreen');
                        }}><Button labelStyle={{textTransform: 'none', fontSize: 17, fontFamily: 'Nunito-SemiBold',}} color='#fff' style={styles.deal_button}>Get Discount</Button></TouchableOpacity>}
                    </View>
                </ScrollView>
                <Animated.View style = {[ styles.animatedHeader, { height: headerHeight, backgroundColor: headerBackgroundColor } ]}>
                    <FastImage style={{height: '100%', width: '100%', resizeMode: 'cover'}} source={{uri: this.props.deal['image_url']}}>
                    </FastImage>
                    <Animated.View style={{position: 'absolute', backgroundColor: headerBackgroundColor, top: 0, right: 0, left: 0, bottom: 0}}> 
                    </Animated.View>
                    <View style={{position: 'absolute', width: d.width-32, height: '100%'}}>
                      <Card elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 42, position: 'absolute'}}>
                        <TouchableOpacity onPress={() => { if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02'); if(Platform.OS != 'ios') StatusBar.setTranslucent(false); goBack();}}>                        
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
    },

    deal_prompt: {
      marginTop: 4,
      color: '#BDBDBD',
      fontFamily: 'Nunito-Bold',
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

    headerText:{
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
  check_availability_loading: state.check_availability_loading,
  check_availability_success: state.check_availability_success,
  check_availability_error: state.check_availability_error,
});
  
const mapDispatchToProps = {
  clearCheckAvailabilityError,
  clearCheckAvailabilitySuccess,
  checkDealAvailability
}

export default connect(mapStateToProps, mapDispatchToProps)(DealView);