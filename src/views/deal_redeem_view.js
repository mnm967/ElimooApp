import React, { Component } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';

const HEADER_MIN_HEIGHT = 96;
const HEADER_MAX_HEIGHT = 280;
const d = Dimensions.get("window");

class DealRedeemView extends Component
{
    constructor(props)
    {
        super(props);
        this.scrollYAnimatedValue = new Animated.Value(0);
    };

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
                            <TouchableOpacity onPress={() => {goBack(null);}}>
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
                      <Text style={styles.deal_title}>{this.props.deal['name']}</Text>
                      <Text style={{marginTop: 32, fontSize: 16, textAlign: 'center', fontFamily: 'Nunito-SemiBold',}}>Redemption Method</Text>
                      <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', paddingTop: 36}}>
                        <Card elevation={6} style={{borderRadius: 12, marginEnd: 18}}>
                          <TouchableOpacity style={{width: 136, height: 136, padding: 18}} onPress={() => navigate('DealInStorePin')}>
                            <FastImage style={{zIndex: 8, resizeMode: 'contain', width: '100%', height: '100%',}} source={require('../assets/redeem-in-store-pin.png')}/>
                          </TouchableOpacity>
                        </Card>
                        <Card elevation={6} style={{borderRadius: 12, marginStart: 18}}>
                          <TouchableOpacity style={{width: 136, height: 136, padding: 24}} onPress={() => navigate('DealQRReader')}>
                            <FastImage style={{zIndex: 8, resizeMode: 'contain', width: '100%', height: '100%',}} source={require('../assets/redeem-qr-code.png')}/>
                          </TouchableOpacity>
                        </Card>
                      </View>
                    </View>
                </ScrollView>
                <Animated.View style = {[ styles.animatedHeader, { height: headerHeight, backgroundColor: headerBackgroundColor } ]}>
                    <FastImage style={{height: '100%', width: '100%', resizeMode: 'cover'}} source={{uri: this.props.deal['image_url']}}>
                    </FastImage>
                    <Animated.View style={{position: 'absolute', backgroundColor: headerBackgroundColor, top: 0, right: 0, left: 0, bottom: 0}}> 
                    </Animated.View>
                    <View style={{position: 'absolute', width: d.width-32, height: '100%'}}>
                      <Card elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 42, position: 'absolute'}}>
                        <TouchableOpacity onPress={() => { goBack(null);}}>
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
});
  
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DealRedeemView);