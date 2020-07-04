import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Modal, { ModalButton, ModalContent, ModalFooter, ModalTitle, SlideAnimation } from 'react-native-modals';

export default class ErrorModal extends React.Component {
    render(){
        const {onTouchOutside, visible, title, text, buttonText, onButtonClick} = this.props;
        return (
            <Modal
        visible={visible}
        onTouchOutside={onTouchOutside}
        footer={
          <ModalFooter>
            <TouchableOpacity style={{width: 356, height: 56, justifyContent: 'center', alignItems: 'center'}} onPress={onButtonClick}>
              <Text style={{fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#FF9E02'}} >{buttonText}</Text>
            </TouchableOpacity>
          </ModalFooter>
        }
        modalTitle={<ModalTitle textStyle={{fontFamily: 'Nunito-Bold',}} title={title} />}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
      >
        <ModalContent style={{paddingStart: 64, paddingEnd: 64, width: 356}}>
          <Text style={{color: '#555', fontSize: 18, fontFamily: 'Nunito-SemiBold', textAlign: 'center', marginTop: 32}}>{text}</Text>
        </ModalContent>
      </Modal>
        );
    }
}