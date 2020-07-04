import * as React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { BottomNavigation } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { setCurrentActiveDeal, setSettingsPushNotificationsEnabled } from '../actions/redux_actions';
import DropDownHolder from '../util/DropDownHandler';
import { AccountScreen } from './account_screen';
import { FavouritesScreen } from './favourites_screen';
import { HomeScreen } from './home_screen';
import { NotificationsScreen } from './notifications_screen';
import NotificationHandler from '../util/NotificationHandler';
import OneSignal from 'react-native-onesignal';
import Modal, { ModalContent, SlideAnimation } from 'react-native-modals';

const guest = [
  { key: 'home', title: 'Home', icon: 'home' },
  { key: 'profile', title: 'Profile', icon: 'account-circle' },
];
const norm = [
  { key: 'home', title: 'Home', icon: 'home' },
  { key: 'favourites', title: 'Favourites', icon: 'bookmark-outline' },
  { key: 'id', title: 'ID', icon: (props) => <FastImage {...props} source={require('../assets/endless-icon.png')} resizeMode='contain' style={{height: 25, width: 36,  backgroundColor: 'transparent'}}/> },
  { key: 'notifications', title: 'Notifications', icon: 'email-outline' },
  { key: 'profile', title: 'Profile', icon: 'account-circle' },
];

var myInterval;
class MainNavigation extends React.Component {
  componentDidMount(){
    if(this.props.user['id'] != '--guest-user--' && this.props.is_push_notifications_enabled == true){
      OneSignal.setSubscription(true);
      OneSignal.init("9986f240-b0ac-463b-816d-8ff06175b69b", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
      OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
      
      if(Platform.OS === 'ios'){
        OneSignal.promptForPushNotificationsWithUserResponse((permission) => {
          if(permission == false){
            this.props.setSettingsPushNotificationsEnabled(false);
          }
        });
      }

      OneSignal.addEventListener('received', this.onReceived);
    }else{
      OneSignal.setSubscription(false);
    }
  }
onReceived(notification) {
    if(NotificationHandler.notificationCallback != null && NotificationHandler.notificationCallback != undefined)
    NotificationHandler.notificationCallback();
}
  state = {
    index: 0,
    routes: this.props.user['id'] == "--guest-user--" ? guest : norm,

    expiryDate: 'N/A',
    first_name: this.props.user['first_name'],
    time: format(new Date(), 'kk:mm:ss'),
    imageURI: {uri: this.props.user['profile_image_url']},
    accountModalVisible: false
  };
  openDeal = (deal) => {
    DropDownHolder.dropDown.closeAction();
    this.props.setCurrentActiveDeal(deal);

      const { navigate } = this.props.navigation;
      navigate('Deal', {avoidReset: true});
  };
  openCategory = (category, is_favourite) => {
    DropDownHolder.dropDown.closeAction();

    const { navigate } = this.props.navigation;
    navigate('CategoryScreen', {category_name: category, is_favourite: is_favourite, is_store: false});
  };
  openSearch = () => {
    DropDownHolder.dropDown.closeAction();

    const { navigate } = this.props.navigation;
    navigate('SearchScreen');
    
  };
  openUserIDScreen = () => {
    DropDownHolder.dropDown.closeAction();
    const { navigate } = this.props.navigation;
    navigate('UserIDScreen');
  };
  openPolicyScreen = (isTerms) => {
    DropDownHolder.dropDown.closeAction();
    const { navigate } = this.props.navigation;
    navigate('PolicyScreen', {isTerms: isTerms});
  };
  openSettingsScreen = () => {
    DropDownHolder.dropDown.closeAction();
    const { navigate } = this.props.navigation;
    navigate('SettingsScreen');
  };
  openSpecialDealsScreen = () => {
    DropDownHolder.dropDown.closeAction();
    const { navigate } = this.props.navigation;
    navigate('SpecialDealsScreen');
  };
  openTopTipsScreen = () => {
    DropDownHolder.dropDown.closeAction();
    const { navigate } = this.props.navigation;
    navigate('TopTipsScreen');
  };
  getHomeScreen = () => {
    const h = <HomeScreen openDeal={this.openDeal}/>;
    return h;
  };
  getFavouritesScreen = () => {
    const h = <FavouritesScreen openDeal={this.openDeal}/>;
    return h;
  };
  getAccountScreen = () => {
    const h = <AccountScreen openUserIDScreen={this.openUserIDScreen}/>;
    return h;
  };
  

  _handleIndexChange = (index) => {
    if(index != 2){
      this.setState({ index })
    }else{
      this.showAccountModal();
    }
  };
  _renderScene = BottomNavigation.SceneMap({
    home: () => <HomeScreen openDeal={this.openDeal} openCategory={this.openCategory} openSearch={this.openSearch} openSpecialDealsScreen={this.openSpecialDealsScreen} openTopTipsScreen={this.openTopTipsScreen}/>,
    favourites: () => <FavouritesScreen openDeal={this.openDeal} openCategory={this.openCategory} openSearch={this.openSearch}/>,
    notifications: () => <NotificationsScreen openDeal={this.openDeal}/>,
    profile: () => <AccountScreen openUserIDScreen={this.openUserIDScreen} openPolicyScreen={this.openPolicyScreen} openSettingsScreen={this.openSettingsScreen} gotoLogin={() => this.props.navigation.state.params.mainNavigation('MainLoginScreen')}/>,
  }); 
  _guest_renderScene = BottomNavigation.SceneMap({
    home: () => <HomeScreen openDeal={this.openDeal} openCategory={this.openCategory} openSearch={this.openSearch} openSpecialDealsScreen={this.openSpecialDealsScreen} openTopTipsScreen={this.openTopTipsScreen}/>,
    profile: () => <AccountScreen openUserIDScreen={this.openUserIDScreen} openPolicyScreen={this.openPolicyScreen} openSettingsScreen={this.openSettingsScreen} gotoLogin={() => this.props.navigation.state.params.mainNavigation('MainLoginScreen')}/>,
  });

  showAccountModal = () =>{
    this.setState({time: format(new Date(), 'kk:mm:ss')});
    this.setState({accountModalVisible: true});
    myInterval = setInterval(() => {this.setState({time: format(new Date(), 'kk:mm:ss')})}, 1000);
  }
  hideAccountModal = () =>{
    this.setState({accountModalVisible: false});
    clearInterval(myInterval);
  }

  render() {
    return (
        <>
        {this.props.user['id'] != '--guest-user--' && <Modal
            visible={this.state.accountModalVisible}
            rounded={true}
            modalStyle={{borderRadius: 33}}
            onTouchOutside={() => {this.hideAccountModal()}}    
            modalAnimation={new SlideAnimation({
                slideFrom: 'bottom',
            })}>
            <ModalContent style={{paddingTop: 0, paddingBottom: 0, width: 324}}>
            <View style={styles.main_container}>
              <View style={styles.main_holder}>
                  <Card elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 0, marginEnd: -20, position: 'absolute', zIndex: 999, right: 0}}>
                    <TouchableOpacity onPress={() => { this.hideAccountModal()}}>
                      <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                        <Icon name="close" size={32} color="#424242" />
                      </View>
                    </TouchableOpacity>
                  </Card>
                {false && <Text style={styles.title_text}>ElimooID</Text>}
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
        {Platform.OS === 'ios' && <View style={{width: '100%', height: 24, backgroundColor: 'transparent'}} />}
       {Platform.OS === 'ios' &&<StatusBar backgroundColor="transparent" barStyle="dark-content" />}
       {Platform.OS === 'android' &&<StatusBar backgroundColor="#FF9E02" barStyle="light-content" />}
        <NavigationEvents onWillFocus={() => {
          if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02');
          if(Platform.OS != 'ios') StatusBar.setTranslucent(false);
        }} />
        <BottomNavigation
            navigationState={this.state}
            labeled={false}
            barStyle={{ backgroundColor: "#fff" }}
            activeColor="#FF9E02"
            inactiveColor="#000"
            sceneAnimationEnabled={false}
            onIndexChange={this._handleIndexChange}
            renderScene={this.props.user['id'] == "--guest-user--" ? this._guest_renderScene : this._renderScene}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
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
    borderColor: 'transparent',
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
  is_push_notifications_enabled: state.is_push_notifications_enabled
});
  
const mapDispatchToProps = {
  setCurrentActiveDeal,
  setSettingsPushNotificationsEnabled
}
  
export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);