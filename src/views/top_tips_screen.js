import React from "react";
import { Dimensions, Linking, StatusBar, StyleSheet, ScrollView, Text, View, Platform } from "react-native";
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import DropDownHolder from '../util/DropDownHandler';
import LinearGradient from 'react-native-linear-gradient';


const d = Dimensions.get("window");
const w = d.width;

class TopTipsScreen extends React.Component {
  
  openDeal = (deal) => {
    DropDownHolder.dropDown.closeAction();
    this.props.setCurrentActiveDeal(deal);

    const { navigate } = this.props.navigation;
    navigate('Deal', {avoidReset: true});
  };

  state = {
    
  };
  render() {
    const { goBack } = this.props.navigation;
    return (
      <>
      {Platform.OS === 'ios' && <View style={{width: '100%', height: 24, backgroundColor: 'transparent'}} />}
       {Platform.OS === 'ios' &&<StatusBar backgroundColor="transparent" barStyle="dark-content" />}
       {Platform.OS === 'android' &&<StatusBar backgroundColor="#FF9E02" barStyle="light-content" />}
      <View style={styles.MainViewHolder}>
        <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('#FF9E02');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(false);
            }} />
        <View style={{flex: 1}}> 
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{height: '100%', width: '100%'}}>
            <Card onPress={() => { goBack(null);}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 40, marginStart: 16, position: 'absolute', zIndex: 999}}>      
                <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                  <Icon name="chevron-left" size={32} color="#424242" />
                </View>
            </Card>
            <Text style={styles.category_title}>Elimoo Top Tips</Text>
            <View style={styles.scrollContent}> 
            {this.props.top_tips.map((item, index) =>
                    <Card key={item['id']} elevation={5} style={styles.tip_card} onPress={() => Linking.openURL(item['link']).catch((e) => {})}>
                      <View style={{overflow: 'hidden', borderRadius: 12}}>
                        <FastImage style={{height: 256, resizeMode: 'cover'}} source={{uri: item['image_url']}}>
                        </FastImage>
                      </View>
                      <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, borderRadius: 12}}> 
                      <LinearGradient
                        colors={['transparent', 'transparent', 'transparent', item['color']+'33',  item['color']+'33', item['color']+'BF']}
                        style={{borderRadius: 12, ...StyleSheet.absoluteFillObject}}></LinearGradient>
                      </View>
                      <View style={{flex: 2, flexDirection: 'row', width: "100%", position: 'absolute', bottom: 0, height: 56, paddingBottom: 64}}>
                          <View style={{height: 64}}>
                            <Text style={{fontFamily: 'Nunito-SemiBold', fontSize: 14, color: '#fff', textAlign: 'center', marginStart: 8, marginEnd: 8}}>{item['name']}</Text>
                          </View>
                        </View>
                  </Card>
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
  tip_card : {
    width: d.width/2-24,
    height: 256,
    margin: 8,
    borderRadius: 12
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
    paddingTop: 16,
    paddingBottom: 16,
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
    fontFamily: 'NunitoSans-Black',
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
  top_tips: state.top_tips
});

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(TopTipsScreen);