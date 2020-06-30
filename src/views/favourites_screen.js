import React from "react";
import { Animated, Dimensions, FlatList, LayoutAnimation, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, UIManager, View } from "react-native";
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { getUserFavouriteDeals, unlikeDealHome } from '../actions/redux_actions';


const d = Dimensions.get("window");
const w = d.width;

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
        duration: 250
      }),
    ];

    Animated.sequence(animations).start(() => { 
      this.props.list();
      this.setState({isVisible: false}, () => {
        this.props.unlikeDealHome(this.props.user['id'], this.props.item);
      })
    })
  }

  render() {
    const { item, list } = this.props;
    const opacityAnimation = this.state.animation;

    return (
      <>
      {this.state.isVisible && <Animated.View style={{transform:[{scale: this.state.animation}], opacity: opacityAnimation}}>
              <View style={{padding: 8}}>
                <Card elevation={3} style={styles.deal_item_holder} onPress={() => {list(); this.props.openDeal(item)}}>
                  <TouchableOpacity style={styles.deal_like_icon_view_active} onPress={() => {this.startAnimation()}}>
                    <Icon name="heart-outline" style={{display: 'none'}} size={24} color="#000" />
                    <Icon name="heart" style={{display: 'flex'}} size={24} color="#fff" />
                  </TouchableOpacity>
                  <Card.Cover style={{width: '100%', height: 196, resizeMode: 'cover', borderTopStartRadius: 15, borderTopEndRadius: 15}} source={{uri: item['image_url']}} />
                  <Card.Content>
                    <View style={{flex: 2, flexDirection: 'row', width: "100%"}}>
                      <View style={{width: "30%", marginTop: 8}}>
                        <FastImage style={{zIndex: 8, resizeMode: 'cover', width: '100%', height: 48}} source={{uri: item['store_logo_url']}}/>
                      </View>
                      <View style={{width: "70%", paddingTop: 8, justifyContent: 'center'}}>
                        <Text style={{textAlign: 'right', fontFamily: 'Nunito-Bold', color: '#000', fontSize: 12, minHeight: 36}} numberOfLines={2}>{item['name']}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
            </View>
      </Animated.View>}
      </>
    );
  }
}

class MyFavouritesScreen extends React.Component {
  componentDidMount(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  componentDidUpdate(){

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
  remListener = () => {
    LayoutAnimation.easeInEaseOut();
  }

  state = {
    entries: [1, 2, 3, 4, 5],
    categories: ["Food & Drink", "Clothing", "Technology", "Restaurants", "Adventures", "Travel"],
    slider1ActiveSlide: 0,
  };

  _onRefresh = () => {
    this.props.getUserFavouriteDeals(this.props.user['id'], false);
  }

  render() {
    return (
      <View style={styles.MainViewHolder}>
        {Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>}
        <TouchableWithoutFeedback style={{width: "100%"}} onPress={() => this.props.openSearch()}>
          <View style={styles.search_header}>
            <Card elevation={12} borderRadius={12} style={{height: 48}}>
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
        <ScrollView
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.props.favourite_deals_loading}
              tintColor="#FF9E02" 
              titleColor="#FF9E02"
              colors={["#FF9E02"]}
              onRefresh={this._onRefresh}
            />
          }
          style={{height: '100%', width: '100%'}}>
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
            <Text style={styles.category_title}>Your Faves</Text>
            <View style={styles.scrollContent}> 
            {this.props.favourite_deals.map((item) =>
              <Item item={item} 
              key={item['id']}
              list={this.remListener} 
              user={this.props.user}
              openDeal={this.props.openDeal}
              unlikeDealHome={this.props.unlikeDealHome}/>
            )}
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
  scrollContent: {
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',
    paddingStart: 8,
    paddingEnd: 8     // allow multiple rows
  },
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
    alignSelf: 'center',
    fontFamily: 'Nunito-Regular',
    color: '#757575'
  },
  main_carousel: {
    width: '100%',
    height: 256
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
    fontFamily: 'NunitoSans-Black',
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 16
  },
  deal_item_holder: {
    width: w/2-24,
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
  favourite_deals_loading: state.favourite_deals_loading,
  favourite_deals_success: state.favourite_deals_success,
  favourite_deals_error: state.favourite_deals_error,
});

const mapDispatchToProps = {
  getUserFavouriteDeals,
  unlikeDealHome
}

const FavouritesScreen = connect(mapStateToProps, mapDispatchToProps)(MyFavouritesScreen);
export { FavouritesScreen };

