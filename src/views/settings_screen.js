import React from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, PushNotificationIOS } from "react-native";
import { Card, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { setSettingsPushNotificationsEnabled } from '../actions/redux_actions';
import { requestNotifications } from "react-native-permissions";


const d = Dimensions.get("window");
const w = d.width;

class SettingsScreen extends React.Component {
  render() {
    const { goBack } = this.props.navigation;
    return (
      <>
      {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
      <View style={styles.MainViewHolder}>
        <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>
        <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(false);
            }} />
        <View style={{flex: 1}}> 
        <View
          style={{ width: '100%'}}>
            <Card onPress={() => { goBack(null);}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 40, marginStart: 16, position: 'absolute', zIndex: 999}}>      
                <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                  <Icon name="chevron-left" size={32} color="#424242" />
                </View>
            </Card>
            <Text style={styles.category_title}>Settings</Text>
            <View style={styles.scrollContent}> 
                <ScrollView showsHorizontalScrollIndicator={false} 
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
                      <View style={styles.setting_item}>
                        <View style={styles.setting_text_holder}>
                          <Text style={styles.setting_text}>Push Notifications</Text>
                        </View>
                        <View style={styles.setting_icon_holder}>
                          <Switch value={this.props.is_push_notifications_enabled} 
                                  onValueChange={() => {
                                    if(!this.props.is_push_notifications_enabled == true && Platform.OS === 'ios') {
                                      requestNotifications(['alert', 'badge', 'sound']).then(({status, settings}) => {
                                        
                                      });
                                    } 
                                    this.props.setSettingsPushNotificationsEnabled(!this.props.is_push_notifications_enabled)
                                  }}
                                  color="#FF9E02"/>
                        </View>
                      </View>
                      {this.props.user['user_has_password'] && <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePasswordScreen')} style={styles.setting_item}>
                        <View style={styles.setting_text_holder}>
                          <Text style={styles.setting_text}>Change Password</Text>
                        </View>
                        <View style={styles.setting_icon_holder}>
                          <Icon name="chevron-right" size={36} color="#000000" />
                        </View>
                      </TouchableOpacity>}
                </ScrollView>
            </View>
        </View>
        </View>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  MainViewHolder: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff"
  },
  ViewHolder: {
    padding: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    minHeight: d.height,
  },
  setting_item: {
    height: 72,
    width: "100%",
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 16,
    paddingEnd: 8,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderColor: '#f6f6f6',
    borderWidth: 2
  },
  setting_text_holder: {
    height: '100%',
    width: '85%',
    justifyContent: 'center',
  },
  setting_text: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
  },
  setting_icon_holder: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  category_title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    paddingTop: 32,
    paddingBottom: 16,
    paddingStart: 78
  },
});
const mapStateToProps = state => ({
  user: state.user,
  is_push_notifications_enabled: state.is_push_notifications_enabled
});

const mapDispatchToProps = {
  setSettingsPushNotificationsEnabled
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);