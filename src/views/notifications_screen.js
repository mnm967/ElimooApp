import { formatDistance } from 'date-fns';
import React from "react";
import { Animated, LayoutAnimation, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
import { Card } from "react-native-paper";
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { getUserNotifications, removeUserNotification } from '../actions/redux_actions';

class Item extends React.Component {
  constructor() {
    super(); 
    this.animatedValue = new Animated.Value(0);
    this.state = { animation: new Animated.Value(1), isVisible: true };
  }

  startAnimation (){
    const animations = [
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 0
      }),
    ];

    Animated.sequence(animations).start(() => {
      var it = this.props.item;this.props.item
      LayoutAnimation.easeInEaseOut(() => {
        this.props.onRemoveItem(it);
      });
      this.setState({isVisible: false}, () => { 
      });
    })
  }

  render() {
    const { item } = this.props;
    const opacityAnimation = this.state.animation;

    var itemDate = new Date();
    itemDate.setTime(itemDate.getTime() - item['millisecondsAgo']);

    return (
      <>
      {this.state.isVisible && 
        <SwipeRow leftOpenValue={85}>
          <Animated.View style={{transform:[{scale: this.state.animation}], opacity: opacityAnimation}}>
        <View style={{height: '100%', width: 96, justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => {
                  this.startAnimation();
                }}>
                  <Card elevation={5} style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 1000,  margin: 8}}>
                    <View style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}><Icon name="close" size={32} color="#FF3A3A" /></View>
                  </Card>
                </TouchableOpacity>
            </View>
            </Animated.View>
            <Animated.View style={{transform:[{scale: this.state.animation}], opacity: opacityAnimation}}>
            <View style={{backgroundColor: '#fff'}}>
            <Card elevation={5} style={{marginTop: 8, marginBottom: 16, marginStart: 8, marginEnd: 8, borderRadius: 12, padding: 4}}>
            <TouchableOpacity style={styles.notification_holder} onPress={() => this.props.openDeal(item['deal'])}>
              <View style={styles.notification_top}>
                <View style={styles.notification_place_name_holder}>
                  <Text style={styles.notification_place_name}>{item['store_name']}</Text>
                </View>
                <View style={styles.notification_time_holder}>
                  <Text style={styles.notification_time}>{formatDistance(itemDate, new Date(), {addSuffix: true})}</Text>
                </View>
              </View>
              <View style={styles.notification_bottom}>
                <View style={styles.notification_content}>
              <Text numberOfLines={2} style={styles.notification_title}>{item['title']}</Text>
                  <Text numberOfLines={2} style={styles.notification_description}>{item['text']}</Text>
                </View>
                <View style={styles.notification_icon_holder}>
                  <Icon name="chevron-right" size={48} color="#000000CC" style={{width: 36}} />
                </View>
              </View>
            </TouchableOpacity>
            </Card>
            </View>
            </Animated.View>
      </SwipeRow>}
      </>
    );
  }
}
//Get the sweet deal of 2 for only R189.90. Click to find out more.
class MyNotificationsScreen extends React.Component {
  constructor(props){
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  onRemoveItem = (item) => {
    // var newList = this.state.entries.filter((i) => {return i['id'] !== item['id']});
    // this.setState({entries: newList}, () => {
      this.props.removeUserNotification(item['id']);
    //});
  }
  componentDidUpdate(){
    // if(this.props.user_notifications.length != this.state.entries.length)
    //   this.setState({entries: this.props.user_notifications})
  }
  _renderItem = ({item, index}) => {
    return (
      <Item item={item} 
      key={item}
      openDeal={this.props.openDeal}
      onRemoveItem={this.onRemoveItem} />
    );
  }

  state = {
    entries: this.props.user_notifications,
  };

  render() {
    return (
      <View style={styles.MainViewHolder}>
        <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>
        <Animated.View style={{flex: 1}}>
              <View style={styles.ViewHolder}>
                <Text style={styles.main_title}>Notifications</Text>
                <ScrollView
                    style={styles.notifications_flatList}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.props.get_user_notifications_loading}
                        tintColor="#FF9E02" 
                        titleColor="#FF9E02"
                        colors={["#FF9E02"]}
                        onRefresh={() => this.props.getUserNotifications(this.props.user['id'])}
                      />
                    }
                    showsVerticalScrollIndicator={false}>
                      {this.props.user_notifications.map((item) => 
                        <Item item={item} 
                        key={item['id']}
                        openDeal={this.props.openDeal}
                        onRemoveItem={this.onRemoveItem} />
                      )}
                      <View style={{height: 72}}>

                      </View>
                    </ScrollView>
              </View>
        </Animated.View>
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
    padding: 16,
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
    paddingBottom: 16,
    paddingStart: 12
  },
  notifications_flatList: {
    width: "100%",
    height: '100%',
    marginBottom: 56
  },

  notification_holder: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 8,
    paddingEnd: 8,
  },
  notification_top: {
    width: '100%',
    flexDirection: 'row'
  },
  notification_place_name_holder: {
    width: '65%'
  },
  notification_time_holder: {
    width: '35%'
  },
  notification_time: {
    width: '100%',
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#9E9E9E'
  },
  notification_place_name: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#FF9E02'
  },
  notification_bottom: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 5
  },
  notification_content: {
    width: '85%'
  },
  notification_icon_holder: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  notification_title: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  notification_description: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  }
});
const mapStateToProps = state => ({
  user: state.user,
  user_notifications: state.user_notifications,
  get_user_notifications_loading: state.get_user_notifications_loading,
  get_user_notifications_success: state.get_user_notifications_success,
  get_user_notifications_error: state.get_user_notifications_error,
});

const mapDispatchToProps = {
  getUserNotifications,
  removeUserNotification
}

const NotificationsScreen = connect(mapStateToProps, mapDispatchToProps)(MyNotificationsScreen);
export { NotificationsScreen };
