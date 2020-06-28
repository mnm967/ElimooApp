import { format } from 'date-fns';
import * as React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

const d = Dimensions.get("window");

var myInterval;
class UserIDScreen extends React.Component {
  state = {
    expiryDate: 'N/A',
    first_name: this.props.user['first_name'],
    time: format(new Date(), 'kk:mm:ss'),
    imageURI: {uri: this.props.user['profile_image_url']}
  };
  componentDidMount(){
    myInterval = setInterval(() => {this.setState({time: format(new Date(), 'kk:mm:ss')})}, 1000);
  }
  componentWillUnmount(){
    clearInterval(myInterval);
  }
  render(){
    const { goBack } = this.props.navigation;
    return (
      <>
        <StatusBar backgroundColor="#FF9E02" barStyle="light-content" />
          <View style={{width: '100%', height: '100%'}}>
            <View style={styles.main_container}>
              <View style={styles.main_holder}>
              <Card onPress={() => { goBack(null);}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000,  marginTop: 28, marginStart: 8, position: 'absolute', zIndex: 999}}>
                          <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                            <Icon name="chevron-left" size={32} color="#424242" />
                          </View>
                      </Card>
                <Text  style={styles.title_text}>ElimooID</Text>
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
            </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
    },
    bottom: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 36
    },
    main_holder: {
      marginTop: 24,
      marginStart: 24,
      marginEnd: 24,
      padding: 24,
      height: '100%',
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
  user: state.user
});

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserIDScreen);