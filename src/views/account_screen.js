import React from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, Linking, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { resetAuthStore, guestUser } from "../actions/redux_actions";
import OneSignal from "react-native-onesignal";

class MyAccountScreen extends React.Component {
  componentDidMount(){
    if(this.props.user['id'] == '--guest-user--'){
      this.props.gotoLogin();
    }
  }
  render() {
    return (
      <View style={styles.MainViewHolder}>
        <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>
        <ScrollView showsHorizontalScrollIndicator={false} 
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
              <View style={styles.ViewHolder}>
                <Text style={styles.main_title}>Account</Text>
                <View>
                  {false &&<TouchableOpacity onPress={() => this.props.openUserIDScreen()} style={styles.setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>My ID</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View>
                  </TouchableOpacity>}
                  <TouchableOpacity onPress={() => this.props.openSettingsScreen()} style={styles.setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>Settings</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL("https://www.lithiumtech.co.za/").catch((e) => {})} style={styles.setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>About</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL("https://www.lithiumtech.co.za/contact.html").catch((e) => {})} style={styles.setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>Support</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => Linking.openURL("https://www.lithiumtech.co.za/contact.html").catch((e) => {})} style={styles.contact_setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>Contact</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => this.props.openPolicyScreen(true)} style={styles.setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>Terms Of Service</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View> 
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.openPolicyScreen(false)} style={styles.setting_item}>
                    <View style={styles.setting_text_holder}>
                      <Text style={styles.setting_text}>Privacy Policy</Text>
                    </View>
                    <View style={styles.setting_icon_holder}>
                      <Icon name="chevron-right" size={36} color="#000000" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {OneSignal.setSubscription(false); this.props.guestUser(); this.props.gotoLogin()}} style={styles.logout_setting_item}>
                    <View style={styles.logout_text_holder}>
                      <Text style={styles.logout_text}>Log Out</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainViewHolder: {
    height: "100%",
    width: "100%",
    backgroundColor: '#fff'
  },
  ViewHolder: {
    marginStart: 8,
    marginEnd: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    height: 256,
    backgroundColor: 'transparent',
  },
  main_title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    paddingTop: 16,
    paddingStart: 16,
    paddingBottom: 32
  },
  setting_item: {
    height: 36,
    width: "100%",
    paddingTop: 32,
    paddingBottom: 32,
    paddingStart: 24,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderColor: '#f6f6f6',
    borderWidth: 2,
    
  },
  contact_setting_item: {
    height: 36,
    width: "100%",
    paddingTop: 32,
    paddingBottom: 32,
    paddingStart: 24,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 32,
    marginTop: 24,
    borderColor: '#f6f6f6',
    borderWidth: 2
  },
  logout_setting_item: {
    height: 36,
    width: "100%",
    paddingTop: 32,
    paddingBottom: 32,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 32,
    marginTop: 24,
    borderColor: '#f6f6f6',
    borderWidth: 2
  },
  setting_text_holder: {
    height: '100%',
    width: '85%',
    justifyContent: 'center',
  },
  logout_text_holder: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  setting_text: {
    fontSize: 21,
    fontFamily: 'Nunito-SemiBold',
  },
  logout_text: {
    fontSize: 21,
    color: '#EF5454',
    fontFamily: 'Montserrat-SemiBold',
  },
  setting_icon_holder: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {
  resetAuthStore,
  guestUser
}

const AccountScreen = connect(mapStateToProps, mapDispatchToProps)(MyAccountScreen);
export { AccountScreen };
