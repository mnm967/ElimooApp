import * as React from 'react';
import { Text } from 'react-native';
import Modal, { ModalContent, SlideAnimation } from 'react-native-modals';
import { ActivityIndicator } from 'react-native-paper';

export default class LoadingModal extends React.Component {
    render(){
        const {onTouchOutside, visible, text} = this.props;
        return (
            <Modal
                visible={visible}
                onTouchOutside={onTouchOutside}    
                modalAnimation={new SlideAnimation({
                    slideFrom: 'left',
                })}>
                <ModalContent style={{paddingTop: 64, paddingBottom: 64, width: 356}}>
                <ActivityIndicator size="large" animating={true} color="#FF9E02" />
                <Text style={{color: '#FF9E02', fontSize: 18,  textAlign: 'center', marginTop: 32, fontFamily: 'Nunito-Bold',}}>{text}</Text>
                </ModalContent>
            </Modal>
        );
    }
}