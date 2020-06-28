import React from "react";
import { Dimensions, FlatList, ScrollView, LayoutAnimation, Linking, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, UIManager, View } from "react-native";
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { clearFavouriteDealsError, clearGetUserNotificationsError, clearHomeDealsError, getUserFavouriteDeals, getUserNotifications, likeDealHome, unlikeDealHome } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import DropDownHolder from '../util/DropDownHandler';
import NotificationHandler from "../util/NotificationHandler";

const d = Dimensions.get("window");

class MyHomeScreen extends React.Component {
  componentDidMount(){
    NotificationHandler.setNotificationHandler(() => {
      if(!this.props.get_user_notifications_loading) this.props.getUserNotifications(this.props.user['id']);
    });
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.getUserFavouriteDeals(this.props.user['id'], true);
  }
  componentWillUnmount(){
    NotificationHandler.setNotificationHandler(null);
  }
  componentDidUpdate(){
    if(this.props.home_deals_error != null || this.props.favourite_deals_error != null || this.props.get_user_notifications_error != null){
      var error = this.props.home_deals_error != null ? this.props.home_deals_error:this.props.favourite_deals_error;
      var errorOutputText = "";
      if(error == 'network_error'){
        errorOutputText = ErrorPrompts.NETWORK_ERROR;
      }else if(error == 'unknown_error'){
        errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
      }
      this.props.clearFavouriteDealsError();
      this.props.clearHomeDealsError();
      this.props.clearGetUserNotificationsError();
      DropDownHolder.showDropdown('error', "Something Went Wrong", errorOutputText);
    }
  }
  _renderItem = ({item, index}) => {
    if(!item['is_trending']) return null;
    return (
        <Card elevation={12} style={styles.slide} onPress={() => {this.props.openDeal(item)}}>
          <View style={{overflow: 'hidden', borderRadius: 12}}>
            <FastImage style={{height: 256, resizeMode: 'cover'}} source={{uri: item['image_url']}}>
            </FastImage>
          </View>
          <View style={{position: 'absolute', backgroundColor: '#00000033', top: 0, right: 0, left: 0, bottom: 0, borderRadius: 12}}> 
          </View>
          <View style={{flex: 2, flexDirection: 'row', width: "70%", height: 256, position: 'absolute', bottom: 0, height: 56, margin: 24, paddingBottom: 64}}>
              <Card elevation={10} style={{width: 72, height: 72, paddingTop: 4, justifyContent:'center', alignItems: 'center', backgroundColor: '#fff'}}>
                <FastImage style={{zIndex: 8, resizeMode: 'cover', width: 64, height: 64}} source={{uri: item['store_logo_url']}}/>
              </Card>
              <View style={{paddingStart: 16}}>
                <Text style={{textAlign: 'left', fontFamily: 'Futura Hv BT', fontSize: 24, color: '#fff'}} numberOfLines={2}>{item['name']}</Text>
              </View>
            </View>
        </Card>
    );
  }
  _renderCategoryItem = ({item, index}) => {
    return (
        <TouchableOpacity style={{padding: 8}} onPress={() => {this.props.openCategory(item, false)}}>
          <View style={styles.category_item}>
            <Text style={{fontSize: 14, marginStart: 16, marginEnd: 16, color: '#FF9E02', fontFamily: 'Nunito-SemiBold',}}>{item}</Text>
          </View>
        </TouchableOpacity>
    );
  }
  _renderTipItem = ({item, index}) => {
    var gradColor1 = item['color']+'33';
    var gradColor2 = item['color']+'BF';
    return (
      <Card elevation={5} style={styles.tip_card} onPress={() => Linking.openURL(item['link']).catch((e) => {})}>
        <View style={{overflow: 'hidden', borderRadius: 12}}>
          <FastImage style={{height: 256, resizeMode: 'cover'}} source={{uri: item['image_url']}}>
          </FastImage>
        </View>
        <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, borderRadius: 12}}> 
        <LinearGradient
          colors={['transparent', 'transparent', 'transparent', gradColor1,  gradColor1, gradColor2]}
          style={{borderRadius: 12, ...StyleSheet.absoluteFillObject}}></LinearGradient>
        </View>
        <View style={{flex: 2, flexDirection: 'row', width: "100%", position: 'absolute', bottom: 0, height: 56, paddingBottom: 64}}>
            <View>
              <Text style={{fontFamily: 'Nunito-SemiBold', fontSize: 14, color: '#fff', textAlign: 'center', marginStart: 8, marginEnd: 8}}>{item['name']}</Text>
            </View>
          </View>
    </Card>
    );
  }
  _renderDealItem = ({item, index}) => {
    var id = item['id'];
    var isFav = false;
    for(i = 0; i < this.props.favourite_deals.length; ++i){
      if(this.props.favourite_deals[i]['id'] == id){
        isFav = true;
        break;
      }
    }
    return (
      <View style={{padding: 8}}>
        <Card elevation={3} style={styles.deal_item_holder} onPress={() => {this.props.openDeal(item)}}>
        {isFav && <TouchableOpacity style={styles.deal_like_icon_view_active} onPress={() => {
    //       LayoutAnimation.configureNext(
    //   LayoutAnimation.create(
    //     500,
    //     LayoutAnimation.Types.easeInEaseOut,
    //     LayoutAnimation.Properties.scaleXY
    //   )
    // ); 
    this.props.unlikeDealHome(this.props.user['id'], item)}}>
            <Icon name="heart-outline" style={{display: 'none'}} size={24} color="#000" />
            <Icon name="heart" style={{display: 'flex'}} size={24} color="#fff" />
          </TouchableOpacity>}
        {!isFav && <TouchableOpacity style={styles.deal_like_icon_view} onPress={() => {
    //       LayoutAnimation.configureNext(
    //   LayoutAnimation.create(
    //     500,
    //     LayoutAnimation.Types.easeInEaseOut,
    //     LayoutAnimation.Properties.scaleXY
    //   )
    // ); 
    this.props.likeDealHome(this.props.user['id'], item)}}>
            <Icon name="heart-outline" style={{display: 'none'}} size={24} color="#000" />
            <Icon name="heart" style={{display: 'flex'}} size={24} color="#fff" />
          </TouchableOpacity>}
          <Card.Cover style={{width: '100%', height: 196, resizeMode: 'cover', borderTopStartRadius: 15, borderTopEndRadius: 15}} source={{uri: item['image_url']}} />
          <Card.Content>
            <View style={{flex: 2, flexDirection: 'row', width: "100%"}}>
              <View style={{width: "30%", marginTop: 8}}>
                <FastImage style={{zIndex: 8, resizeMode: 'cover', width: '100%', height: 48}} source={{uri: item['store_logo_url']}}/>
              </View>
              <View style={{width: "70%", paddingTop: 8, justifyContent: 'center'}}>
                <Text style={{textAlign: 'right', fontFamily: 'Nunito-Bold', color: '#000', fontSize: 12, height: 36}} numberOfLines={2}>{item['name']}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
    </View>
    );
  }

  _onRefresh = () => {
    this.props.getUserFavouriteDeals(this.props.user['id'], true);
  }

  state = {
    entries: [1, 2, 3, 4, 5],
    categories: ["Food & Drink", "Clothing", "Technology", "Restaurants", "Adventures", "Travel"],
    slider1ActiveSlide: 0
  };

  render() {
    return (
      <View style={styles.MainViewHolder}>
        <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>
        <TouchableWithoutFeedback style={{width: "100%"}} onPress={() => this.props.openSearch()}>
          <View style={styles.search_header}>
            <Card elevation={12} borderRadius={12} style={{height: 48}} >
            <View style={styles.search_bar}>
              <Icon style={styles.search_icon} name="magnify" size={24} color="#000000CC" />
              <Text
                      style={styles.search_text_input}
                >Looking for Something?</Text>
            </View>
            </Card>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex: 1}}>
        <ScrollView style={{height: '100%', width: '100%'}}
        refreshControl={
          <RefreshControl
            refreshing={this.props.home_deals_loading}
            tintColor="#FF9E02" 
            titleColor="#FF9E02"
            colors={["#FF9E02"]}
            onRefresh={this._onRefresh}
          />
        }>
        <View style={styles.CategoryViewHolder}>
                <FlatList
                    style={styles.category_flatList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.categories}
                    renderItem={this._renderCategoryItem}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                height: "100%",
                                width: 8,
                                }}
                            />
                        );
                    }}

                    keyExtractor={(item, index) => index.toString()}
                />
          </View>
          {this.props.home_deals.length != 0 && <View>  
              <Carousel
                  ref={c => this._slider1Ref = c}
                  style={styles.main_carousel}
                  data={this.props.home_deals.filter((x, i) => {return x['is_main']})}
                  renderItem={this._renderItem}
                  sliderWidth={d.width}
                  itemWidth={d.width}
                  firstItem={0}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
              <Pagination
                  dotsLength={this.props.home_deals.filter((x, i) => {return x['is_main']}).length}
                  activeDotIndex={this.state.slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'#FF9E02'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor='#000'
                  inactiveDotOpacity={0.2}
                  inactiveDotScale={1}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
              </View>}

              <View style={styles.ViewHolder}>
              {this.props.home_deals.length != 0 && <><Text style={styles.category_title}>This Week&apos;s Pick</Text>
                <FlatList
                    style={styles.deals_flatList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.props.home_deals.filter((x, i) => {return x['is_week_pick']})}
                    renderItem={this._renderDealItem}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                height: "100%",
                                width: 8,
                                }}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                /></>}
                {this.props.home_deals.length != 0 && <><Text style={styles.category_title}>Trending</Text>
                <FlatList
                    style={styles.deals_flatList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.props.home_deals.filter((x, i) => {return x['is_trending']})}
                    renderItem={this._renderDealItem}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={{
                                height: "100%",
                                width: 8,
                                }}
                            />
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                /></>}
                {this.props.home_deals.filter((i) => {return i['is_special'] == true}).length != 0 && <Card elevation={12} style={styles.ad_card} onPress={() => {this.props.openDeal(this.props.home_deals.filter((i) => {return i['is_special'] == true})[0])}}>
                  <View style={{overflow: 'hidden', borderRadius: 12}}>
                    <FastImage style={{height: 256, resizeMode: 'cover'}} source={{uri: this.props.home_deals.filter((i) => {return i['is_special'] == true})[0]['image_url']}}>
                    </FastImage>
                  </View>
                  <View style={{position: 'absolute', backgroundColor: '#00000033', top: 0, right: 0, left: 0, bottom: 0, borderRadius: 12}}> 
                  </View>
                  <View style={{flex: 2, flexDirection: 'row', width: "70%", height: 256, position: 'absolute', bottom: 0, height: 56, margin: 24, paddingBottom: 64}}>
                      <Card elevation={10} style={{width: 72, height: 72, paddingTop: 1, justifyContent:'center', alignItems: 'center', backgroundColor: '#fff'}}>
                        <FastImage style={{zIndex: 8, resizeMode: 'contain', width: 70, height: 70}} source={{uri: this.props.home_deals.filter((i) => {return i['is_special'] == true})[0]['store_logo_url']}}/>
                      </Card>       
                      <View style={{paddingStart: 16}}>
                        <Text style={{textAlign: 'left', fontFamily: 'Futura Hv BT', fontSize: 24, color: '#fff'}}>{this.props.home_deals.filter((i) => {return i['is_special'] == true})[0]['name']}</Text>
                      </View>
                    </View>
                </Card>}
                {this.props.home_deals.length != 0 && <><Text style={styles.category_title}>Special Deals</Text>
                  <View>
                    <FlatList
                      style={styles.deals_flatList}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={this.props.home_deals.filter((x, i) => {if(i < 6) return x['is_special']})}
                      renderItem={this._renderDealItem}
                      ItemSeparatorComponent={() => {
                          return (
                              <View
                                  style={{
                                  height: "100%",
                                  width: 8,
                                  }}
                              />
                          );
                      }}
                      
                      ListFooterComponent={() => {
                        return (                      
                          <View style={{width: 136, height: 232, alignItems: 'center', justifyContent: 'center'}}>
                              <TouchableOpacity onPress={() => this.props.openSpecialDealsScreen()}>
                                <Card elevation={5} style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 1000,  margin: 8}}>
                                  <View style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}><Icon name="arrow-right" size={32} color="#FF9E02" /></View>
                                </Card>
                                <Text style={{fontSize: 20, color: '#FF9E02', fontFamily: 'Nunito-SemiBold', marginTop: 8}}>SEE{"\n"}MORE</Text>
                              </TouchableOpacity>
                          </View>
                        );
                    }}
                      keyExtractor={(item, index) => item['id']}
                  />
                  </View></>}
                {this.props.top_tips.length != 0 && <><Text style={styles.category_title}>Elimoo Top Tips</Text>
                <FlatList
                      style={styles.deals_flatList}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={this.props.top_tips.filter((x, i) => {if(i < 6) return true})}
                      renderItem={this._renderTipItem}
                      ItemSeparatorComponent={() => {
                          return (
                              <View
                                  style={{
                                  height: "100%",
                                  width: 4,
                                  }}
                              />
                          );
                      }}
                      ListFooterComponent={() => {
                          return (                      
                            <View style={{width: 136, height: 232, alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => this.props.openTopTipsScreen()}>
                                  <Card elevation={5} style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 1000,  margin: 8}}>
                                    <View style={{width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}><Icon name="arrow-right" size={32} color="#FF9E02" /></View>
                                  </Card> 
                                  <Text style={{fontSize: 20, color: '#FF9E02', fontFamily: 'Nunito-SemiBold', marginTop: 8}}>SEE{"\n"}MORE</Text>
                                </TouchableOpacity>
                            </View>
                          );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                  /></>}
              </View>
        </ScrollView>
        </View>
      </View>
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
  CategoryViewHolder: {
    paddingStart: 8,
    paddingEnd: 8,
  },
  /*search_header: {
    backgroundColor: "#4bd1a0",
    height: 96,
    borderBottomStartRadius: 32,
    borderBottomEndRadius: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingStart: 16,
    paddingEnd: 16
  },*/
  search_header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingEnd: 24,
    paddingStart: 24,
    paddingBottom: 16,
  },
  search_bar: {
    backgroundColor: "#fff",
    width: "100%",
    height: 48,
    borderColor: "#9E9E9E",
    borderRadius: 12,
    paddingStart: 8,
    paddingEnd: 8,
    flex: 0,
    flexDirection: "row"
  },
  search_icon: {
    alignSelf: 'center'
  },
  search_text_input: {
    width: "92%",
    marginStart: 16,
    fontFamily: 'Nunito-Regular',
    alignSelf: 'center',
    color: '#757575'
  },
  main_carousel: {
    width: '100%',
    height: 256
  },
  slide : {
    height: 256,
    margin: 16,
    borderRadius: 12
  },
  tip_card : {
    width: 184,
    height: 256,
    margin: 8,
    borderRadius: 12
  },
  ad_card : {
    height: 256,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 16,
    borderRadius: 12
  },
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
      width: 16,
      height: 4,
      borderRadius: 0,
      marginHorizontal: 8
  },
  
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    height: 296,
    position: 'absolute',
    zIndex: 999,
    width: "100%"
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
  category_item: {
    borderRadius: 4,
    borderColor: '#FF9E02',
    borderWidth: 2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingStart: 8,
    paddingEnd: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 96,
    height: "100%"
  },
  category_flatList: {
    width: "100%",
    height: 60
  },
  deals_flatList: {
    width: "100%",
  },
  category_title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 12
  },
  deal_item_holder: {
    width: 210,
    borderRadius: 15
  },
  deal_item: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  deal_like_icon_view: {
    margin: 8,
    backgroundColor: '#FFFFFFCC',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 8888,
    right: 0
  },
  deal_like_icon_view_active: {
    margin: 8,
    backgroundColor: '#FF9E02',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 8888,
    right: 0
  }
});
const mapStateToProps = state => ({
  user: state.user,
  favourite_deals: state.favourite_deals,
  home_deals: state.home_deals,
  top_tips: state.top_tips,
  home_deals_loading: state.home_deals_loading,
  home_deals_success: state.home_deals_success,
  home_deals_error: state.home_deals_error,
  favourite_deals_error: state.favourite_deals_error,
  get_user_notifications_error: state.get_user_notifications_error,
  get_user_notifications_loading: state.get_user_notifications_loading
});

const mapDispatchToProps = {
  getUserFavouriteDeals,
  likeDealHome,
  unlikeDealHome,
  clearFavouriteDealsError,
  clearHomeDealsError,
  clearGetUserNotificationsError,
  getUserNotifications
}

const HomeScreen = connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);
export { HomeScreen };

