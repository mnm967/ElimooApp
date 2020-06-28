import React from "react";
import { ScrollView, Animated, Dimensions, FlatList, Keyboard, LayoutAnimation, RefreshControl, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View, Platform } from "react-native";
import FastImage from 'react-native-fast-image';
import { ActivityIndicator, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { clearSearchDealsError, clearSearchDealsSuccess, clearSearchDealsSuccessComplete, likeDealHome, searchDeals, setCurrentActiveDeal, unlikeDealHome } from '../actions/redux_actions';
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
      {Platform.OS === 'ios' && <View style={{width: '100%', height: 20, backgroundColor: '#FF9E02'}} />}
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
class SearchScreen extends React.Component {
  componentDidMount(){
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    setTimeout(() => {
      this.search_input.focus();
    }, 250);
  }
  _renderCategoryItem = ({item, index}) => {
    if(item == 'Stores' && this.state.search_type == 'store'){
      return (
          <TouchableOpacity style={{padding: 8}}>
            <View style={styles.category_item_selected}>
              <Text style={{fontSize: 14, marginStart: 16, marginEnd: 16, color: '#fff', fontFamily: 'Nunito-Bold',}}>{item}</Text>
            </View>
          </TouchableOpacity>
      );
    }else if(item == 'Deals' && this.state.search_type == 'deal'){
      return (
          <TouchableOpacity style={{padding: 8}}>
            <View style={styles.category_item_selected}>
              <Text style={{fontSize: 14, marginStart: 16, marginEnd: 16, color: '#fff', fontFamily: 'Nunito-Bold',}}>{item}</Text>
            </View>
          </TouchableOpacity>
      );
    }
    return (
        <TouchableOpacity style={{padding: 8}} onPress={() => this.setSearchType(item)}>
          <View style={styles.category_item}>
            <Text style={{fontSize: 14, marginStart: 16, marginEnd: 16, color: '#FF9E02', fontFamily: 'Nunito-Bold',}}>{item}</Text>
          </View>
        </TouchableOpacity>
    );
  }
  setSearchType = (type) => {
    if(type == "Stores") this.setState({search_type: 'store'})
    else if(type == "Deals") this.setState({search_type: 'deal'})
    
    this.setState({ currentTerm: '', page: 1, current_deals: [] })
  }
  openDeal = (deal) => {
    DropDownHolder.dropDown.closeAction();
    Keyboard.dismiss();
    this.props.setCurrentActiveDeal(deal);

    const { navigate } = this.props.navigation;
    navigate('Deal', {avoidReset: true});
  };
  remListener = () => {
    //LayoutAnimation.easeInEaseOut();
  }
  executeSearch(text){
    this.props.clearSearchDealsSuccessComplete();
    LayoutAnimation.easeInEaseOut();
    this.setState({currentTerm: text, current_deals: [], page: 1}, () => {
      if(text != '') this.props.searchDeals(text, this.state.search_type, 1);
    });
  }

  state = {
    entries: [1, 2, 3, 4, 5],
    slider1ActiveSlide: 0,
    is_loading_more: false,
    scroll_refreshing: false,
    is_load_complete: false,
    categories: ["Stores", "Deals"],
    search_type: 'store',
    currentTerm: '',
    page: 1,
    current_deals: this.props.search_deals,
  };

  componentDidUpdate(){
    if(this.props.search_deals_success && this.props.search_deals_loading == false){
      try{
        this.props.clearSearchDealsSuccess();
        var currDeals = this.state.current_deals;
        var newArr = currDeals.concat(this.props.search_deals);
        if(this.state.currentTerm == ''){
          this.setState({current_deals: []}, () => {
            LayoutAnimation.easeInEaseOut();
            var currPage = this.state.page;
            this.setState({page: (currPage+1), is_load_complete: true})
          });
        }else{
          this.setState({current_deals: newArr}, () => {
            LayoutAnimation.easeInEaseOut();
            var currPage = this.state.page;
            this.setState({page: (currPage+1), is_load_complete: true})
          });
        }
      }catch(e){
          
      }
    }
    else if(this.props.search_deals_error != null){
      var error = this.props.search_deals_error;
        var errorOutputText = "";
        if(error == 'network_error'){
          errorOutputText = ErrorPrompts.NETWORK_ERROR;
        }else if(error == 'unknown_error'){
          errorOutputText = ErrorPrompts.UNKNOWN_ERROR;
        }
      DropDownHolder.showDropdown('error', "Something Went Wrong", errorOutputText);
      this.props.clearSearchDealsError();
    }
  } 
  
  _onRefresh = () => {
    if(this.state.currentTerm != '') this.executeSearch(this.state.currentTerm)
  }
  _onLoadMore = () => {
    this.setState({is_load_complete: true}, () => {
      this.props.searchDeals(this.state.currentTerm, this.state.search_type, this.state.page);
    });
  }
  openStorePage = (name) => {
    const { navigate } = this.props.navigation;
    navigate('CategoryScreen', {category_name: name, is_favourite: false, is_store: true});
  }
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.MainViewHolder}>
        <StatusBar barStyle="light-content" backgroundColor="#FF9E02"/>
        <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(false);
            }} />
        <View style={{flex: 1}}> 
        <View style={{width: "100%"}}>
          <View style={styles.search_header}>
            <Card elevation={12} borderRadius={12} style={{height: 48}}>
            <View style={styles.search_bar}>
              <Icon style={styles.search_icon} name="chevron-left" size={24} color="#757575" onPress={() => {this.props.navigation.goBack()}}/>
              <TextInput
                      style={styles.search_text_input}
                      ref = {(search_input) => this.search_input = search_input} 
                      returnKeyType="search"
                      placeholder='Looking for Something?'
                      value={this.state.currentTerm}
                      onChangeText={currentTerm => this.executeSearch(currentTerm)}
                      theme={{ colors: { text: '#000000' } }}
                  />
            </View>
            </Card>
          </View>
        </View>
        <View style={styles.CategoryViewHolder}>
              <FlatList
                  style={styles.category_flatList}
                  numColumns={2}
                  keyboardShouldPersistTaps="always"
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
        <ScrollView
          showsHorizontalScrollIndicator={false}
          onScroll={({nativeEvent}) => {
            if(nativeEvent == undefined || nativeEvent == null) return;
              if (isCloseToBottom(nativeEvent)) {
                if(this.props.search_deals_loading == false && this.props.search_deals_complete == false && this.state.is_load_complete){
                  this._onLoadMore();
                }
              }
            }}
          scrollEventThrottle={400}
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              refreshing={this.state.scroll_refreshing}
              tintColor="#FF9E02" 
              titleColor="#FF9E02"
              colors={["#FF9E02"]}
              onRefresh={this._onRefresh}
            />
          }
          style={{width: '100%'}}>
            {this.state.search_type == 'deal' && <View style={styles.scrollContent}> 
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
            </View>}
            {this.state.search_type == 'store' && <>
              {this.state.current_deals.map((item) =>
                  <Card onPress={() => this.openStorePage(item['name'])} key={item['id']} elevation={6} style={{padding: 16, marginStart: 16, marginEnd: 16, marginTop: 8, marginBottom: 8}}>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                    <Card elevation={0} style={{width: 96, height: 96, backgroundColor: '#fff'}}>
                      <FastImage style={{zIndex: 8, resizeMode: 'cover', width: 96, height: 96}} source={{uri: item['logo_url']}}/>
                    </Card>
                    <View style={{paddingStart: 16, justifyContent: 'center', alignItems: 'center', height: 96}}>
                      <Text style={{textAlign: 'left', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000'}} numberOfLines={1}>{item['name']}</Text>
                    </View>
                  </View>
                  </Card>
              )}</>}
            <ActivityIndicator style={{padding: 36}} animating={this.props.search_deals_loading} size={32} color="#FF9E02"></ActivityIndicator>
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
  scrollStoreContent: {
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
    fontFamily: 'Nunito-Regular',
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
    width: w/2-24,
    height: 48
  },
  category_item_selected: {
    borderRadius: 4,
    borderColor: '#FF9E02',
    backgroundColor: '#FF9E02',
    color: '#fff',
    borderWidth: 2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingStart: 8,
    paddingEnd: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: w/2-24,
    height: 48
  },
  category_flatList: {
    width: "100%",
  },
  deals_flatList: {
    width: "100%",
  },
  category_title: {
    fontSize: 32,
    fontWeight: 'bold',
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
  search_deals: state.search_deals,
  favourite_deals: state.favourite_deals,
  search_deals_complete: state.search_deals_complete,
  search_deals_loading: state.search_deals_loading,
  search_deals_success: state.search_deals_success,
  search_deals_error: state.search_deals_error,
});

const mapDispatchToProps = {
  searchDeals, 
  clearSearchDealsError, 
  clearSearchDealsSuccess, 
  likeDealHome,
  unlikeDealHome,
  setCurrentActiveDeal,
  clearSearchDealsSuccessComplete
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);