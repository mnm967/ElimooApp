import React from "react";
import { Animated, Dimensions, LayoutAnimation, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, ScrollView, UIManager, View, Platform } from "react-native";
import FastImage from 'react-native-fast-image';
import { ActivityIndicator, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { clearCategoryDealsError, clearCategoryDealsSuccess, getCategoryDeals, likeDealHome, setCurrentActiveDeal, unlikeDealHome } from '../actions/redux_actions';
import ErrorPrompts from '../constants/error_prompts';
import DropDownHolder from '../util/DropDownHandler';


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

    var id = item['id'];
    var isFav = false;
    for(i = 0; i < this.props.favourite_deals.length; ++i){
      if(this.props.favourite_deals[i]['id'] == id){
        isFav = true;
        break;
      }
    }

    return (
      <>
      <View style={{padding: 8}}>
        <Card elevation={3} style={styles.deal_item_holder} onPress={() => {this.props.openDeal(item)}}>
        {isFav && <TouchableOpacity style={styles.deal_like_icon_view_active} onPress={() => {
          LayoutAnimation.configureNext(
      LayoutAnimation.create(
        500,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleXY
      )
    ); this.props.unlikeDealHome(this.props.user['id'], item)}}>
            <Icon name="heart-outline" style={{display: 'none'}} size={24} color="#000" />
            <Icon name="heart" style={{display: 'flex'}} size={24} color="#fff" />
          </TouchableOpacity>}
        {!isFav && <TouchableOpacity style={styles.deal_like_icon_view} onPress={() => {LayoutAnimation.configureNext(
      LayoutAnimation.create(
        500,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleXY
      )
    ); this.props.likeDealHome(this.props.user['id'], item)}}>
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
    
      </>
    );
  }
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 596;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};
class CategoryScreen extends React.Component {
  componentDidMount(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    setTimeout(() => {
      this.props.getCategoryDeals(this.props.navigation.state.params.category_name, this.state.page, this.props.navigation.state.params.is_store);
    }, 250);
  }
  _renderCategoryItem = ({item, index}) => {
    return (
        <TouchableOpacity style={{padding: 8}}>
          <View style={styles.category_item}>
            <Text style={{fontSize: 14, marginStart: 16, fontFamily: 'Nunito-SemiBold', marginEnd: 16, color: '#FF9E02', fontWeight: 'bold'}}>{item}</Text>
          </View>
        </TouchableOpacity>
    );
  }
  openDeal = (deal) => {
    DropDownHolder.dropDown.closeAction();
    this.props.setCurrentActiveDeal(deal);

    const { navigate } = this.props.navigation;
    navigate('Deal', {avoidReset: true});
    
  };
  remListener = () => {
    //LayoutAnimation.easeInEaseOut();
  }

  state = {
    entries: [1, 2, 3, 4, 5],
    slider1ActiveSlide: 0,
    is_loading_more: false,
    scroll_refreshing: false,
    is_load_complete: false,
    page: 1,
    current_deals: this.props.category_deals,
  };

  componentDidUpdate(){
    if(this.props.category_deals_success && this.props.category_deals_loading == false){
      this.props.clearCategoryDealsSuccess();
      var currDeals = this.state.current_deals;
      var newArr = currDeals.concat(this.props.category_deals);
      this.setState({current_deals: newArr}, () => {
        LayoutAnimation.easeInEaseOut();
        var currPage = this.state.page;
        this.setState({page: (currPage+1), is_load_complete: true})
      });
    }
    else if(this.props.category_deals_error != null){
      var error = this.props.category_deals_error;
        var errorOutputText = "";
        if(error == 'network_error'){
          errorOutputText = ErrorPrompts.NETWORK_ERROR;
        }else if(error == 'unknown_error'){
          errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
        }
      DropDownHolder.showDropdown('error', "Something Went Wrong", errorOutputText);
      this.props.clearCategoryDealsError();
    }
  } 
  
  _onRefresh = () => {
    this.props.clearCategoryDealsSuccess();
    this.props.clearCategoryDealsError();
    this.setState({current_deals: [], page: 1}, () => {
      this._onLoadMore();
    });
  }
  _onLoadMore = () => {
    this.setState({is_load_complete: true}, () => {
      this.props.getCategoryDeals(this.props.navigation.state.params.category_name, this.state.page, this.props.navigation.state.params.is_store);
    });
  }
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
        <ScrollView
          showsHorizontalScrollIndicator={false}
          onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                if(this.props.category_deals_loading == false && this.props.category_deals_complete == false && this.state.is_load_complete){
                  this._onLoadMore();
                }
              }
            }}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl
              refreshing={this.state.scroll_refreshing}
              tintColor="#FF9E02" 
              titleColor="#FF9E02"
              colors={["#FF9E02"]}
              onRefresh={this._onRefresh}
            />
          }
          style={{height: '100%', width: '100%'}}>
            <Card onPress={() => { goBack(null);}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 40, marginStart: 16, position: 'absolute', zIndex: 999}}>      
                <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                  <Icon name="chevron-left" size={32} color="#424242" />
                </View>
            </Card>
            <Text style={styles.category_title}>{this.props.navigation.state.params.category_name}</Text>
            {this.props.category_deals_loading && <ActivityIndicator style={{padding: 36}} size={32} color="#FF9E02"></ActivityIndicator>}
            <View style={styles.scrollContent}> 
            {this.state.current_deals.map((item) =>
              <Item item={item} 
              key={item['id']}
              list={this.remListener} 
              user={this.props.user}
              openDeal={this.openDeal}
              favourite_deals={this.props.favourite_deals}
              unlikeDealHome={this.props.unlikeDealHome}
              likeDealHome={this.props.likeDealHome}
              />
            )}
            </View>
        </ScrollView>
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
  CategoryViewHolder: {
    paddingStart: 8,
    paddingEnd: 8,
  },
  scrollContent: {
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',
    paddingStart: 8,
    minHeight: d.height,
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
    marginStart: 16
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
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    paddingTop: 32,
    paddingBottom: 16,
    paddingStart: 78
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
  category_deals: state.category_deals,
  favourite_deals: state.favourite_deals,
  category_deals_complete: state.category_deals_complete,
  category_deals_loading: state.category_deals_loading,
  category_deals_success: state.category_deals_success,
  category_deals_error: state.category_deals_error,
});

const mapDispatchToProps = {
  getCategoryDeals, 
  clearCategoryDealsError, 
  clearCategoryDealsSuccess, 
  likeDealHome,
  unlikeDealHome,
  setCurrentActiveDeal
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen);