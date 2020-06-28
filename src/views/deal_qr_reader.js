import React, { Component } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import { Card } from 'react-native-paper';
import QRCodeScanner from "react-native-qrcode-scanner";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux';
import md5 from "md5";
import ErrorModal from '../modals/error_modal';


class DealQRReader extends Component {
  constructor(props){
    super(props);
  }
  onSuccess = async e => {
    var scanned = e.data+'';
    scanned = scanned.trim();
    if(md5(scanned) === this.props.current_deal_qr_code){
      const { navigate } = this.props.navigation;
      navigate("DealStorePassword")
    }else{
      this.setState({errorModalVisibility: true});
    }
  };
  onExitErrorView = () => {
    this.setState({errorModalVisibility: false}, () => this.scanner.reactivate());
  }
  state = {
    errorModalVisibility: false
  };
  render() {
    const { goBack } = this.props.navigation;
    return (
        <>  
            <ErrorModal visible={this.state.errorModalVisibility} 
                  title="Incorrect QR Code"
                  buttonText="Try Again"
                  text="The QR Code you have scanned is incorrect" 
                  onTouchOutside={this.onExitErrorView} 
                  onButtonClick={this.onExitErrorView}/>
            <StatusBar translucent barStyle="light-content" backgroundColor="transparent"/>
            <NavigationEvents onWillFocus={() => {
              if(Platform.OS != 'ios') StatusBar.setBackgroundColor('transparent');
              if(Platform.OS != 'ios') StatusBar.setTranslucent(true);
            }} />
            <View style={styles.container}>
                <QRCodeScanner
                onRead={this.onSuccess}
                showMarker={false}
                checkAndroid6Permissions={true}
                ref={elem => {
                    this.scanner = elem;
                }}
                cameraStyle={{ height: Dimensions.get("window").height+28 }}
                markerStyle={{borderColor: '#fff', borderWidth: 0.5}}/>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginStart: 16, marginTop: 72}}>
                <Card onPress={() => { goBack(null);}} elevation={5} style={{width: 36, height: 36, borderRadius: 1000, position: 'absolute', zIndex: 999}}>
                  <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 1000}}>
                    <Icon name="chevron-left" size={36} color="#424242" />
                  </View>
              </Card>
              <Text style={styles.text}>Scan the In Store Elimoo QR Code</Text>
                </View>
            </View>
        </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginStart: 16,
    position: 'absolute',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Nunito-Bold',
  },
});

const mapStateToProps = state => ({
  user: state.user,
  current_deal_qr_code: state.current_deal_qr_code
});
  
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DealQRReader);