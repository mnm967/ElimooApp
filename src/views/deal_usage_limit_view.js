import React, { Component } from 'react';
import { Animated, BackHandler, Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';

const HEADER_MIN_HEIGHT = 96;
const HEADER_MAX_HEIGHT = 280;
const d = Dimensions.get("window");
var m;

var myInterval;
class DealUsageLimitView extends Component
{
    constructor(props)
    {
        super(props);
        this.scrollYAnimatedValue = new Animated.Value(0);
        BackHandler.addEventListener('hardwareBackPress', this.click_func);
    };
    state = {
      timeLeft: '00:00:00',
      nextDate: new Date().getTime()+this.props.current_deal_milliseconds_till_next
    };
    resetStack = () => {
      // if(this.props.navigation.state.params.avoidReset == true){
      //   this.props.navigation.goBack();
      //   return;
      // }
      this.props.navigation.goBack();
      return;
    }
    click_func = () => {
      BackHandler.removeEventListener('hardwareBackPress', this.click_func);
      // if(this.props.navigation.state.params.avoidReset == true){
      //   this.props.navigation.goBack();
      //   return true;
      // }
      this.props.navigation.goBack();
      return true;
    }
    componentDidMount(){
      this.changeTime();
      myInterval = setInterval(this.changeTime, 1000);
    }
    changeTime = () => {
      var countDownDate = this.state.nextDate;
    
      var now = new Date().getTime();
      
      var distance = countDownDate - now;
  
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      hours = hours + (days * 24);
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      var secondsStr = seconds+"";
      if(secondsStr.length == 1) secondsStr = "0"+secondsStr;
      
      var minutesStr = minutes+"";
      if(minutesStr.length == 1) minutesStr = "0"+minutesStr;

      var hoursStr = hours+"";
      if(hoursStr.length == 1) hoursStr = "0"+hoursStr;
      
      var timeLeft = hoursStr+":"+minutesStr+":"+secondsStr;
      this.setState({timeLeft: timeLeft});
    }
    componentWillUnmount(){
      clearInterval(myInterval);
      BackHandler.removeEventListener('hardwareBackPress', this.click_func);
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
                    <View style={{ height: 96, marginBottom: 16, marginStart: 16, padding: 8, justifyContent:'center', alignItems: 'center', borderBottomColor: '#BDBDBD4D', borderBottomWidth: 1, flexDirection: 'row'}}>
                      <View style={{width: '100%', zIndex: 1000, position: 'absolute'}}>
                            <Card elevation={5} style={{width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, margin: 4}}>
                              <TouchableOpacity onPress={() => this.resetStack()}>
                              <View style={{width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                                <Icon name="close" size={32} color="#FF3A3A" />
                              </View>
                              </TouchableOpacity>
                            </Card>
                      </View>
                      <View style={{width: '100%', position: 'absolute'}}>
                        <FastImage style={{zIndex: 8, resizeMode: 'cover', width: 84, height: 84, alignSelf:'center'}} source={{uri: this.props.deal['store_logo_url']}}/>
                      </View>
                    </View>
                    <View style={{padding: 16}}>
                      <Text style={styles.deal_title}>You've Already Used this Deal</Text>
                      <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', marginTop: 8}}>
                          <Icon name="clock-outline" size={96} color="#FF9E02" />
                      </View>
                    </View>
                      <TouchableOpacity ref={component => this.touchable = component} onPress={() => this.resetStack()}><Button labelStyle={{textTransform: 'none', fontFamily: 'Nunito-SemiBold', fontSize: 17}} color='#fff' style={styles.deal_button}>Done</Button></TouchableOpacity>
                      <Text style={{fontSize: 16, textAlign: 'center', fontFamily: 'Montserrat-Regular',}}>Next Usage Available In:</Text>
                      <Text style={{fontSize: 16, textAlign: 'center', marginBottom: 24, fontFamily: 'Montserrat-SemiBold',}}>{this.state.timeLeft}</Text>
                </ScrollView>
                <Animated.View style = {[ styles.animatedHeader, { height: headerHeight, backgroundColor: headerBackgroundColor } ]}>
                    <FastImage style={{height: '100%', width: '100%', resizeMode: 'cover'}} source={{uri: this.props.deal['image_url']}}>
                    </FastImage>
                    <Animated.View style={{position: 'absolute', backgroundColor: headerBackgroundColor, top: 0, right: 0, left: 0, bottom: 0}}> 
                    </Animated.View>
                    <View style={{position: 'absolute', width: d.width-32, height: '100%'}}>
                      <Card elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 42, position: 'absolute'}}>
                        <TouchableOpacity onPress={() => this.resetStack()}>
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
      justifyContent: 'center',
      marginEnd: 16,
      marginStart: 16,
      marginBottom: 16,
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
  current_deal_milliseconds_till_next: state.current_deal_milliseconds_till_next
});
  
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DealUsageLimitView);