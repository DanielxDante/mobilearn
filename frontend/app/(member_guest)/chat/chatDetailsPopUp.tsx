import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Pressable, StyleSheet, Alert } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome";

import { chatDetailsPopUp as Constants } from "@/constants/textConstants";
import useAppStore from '@/store/appStore';

interface ChatDetailsPopUpProps {
    handleModal: () => void;
    chat_id: string;
    participant_email: string;
    participant_type: string;
    refreshData: () => void;
}

const ChatDetailsPopUp: React.FC<ChatDetailsPopUpProps> = ({
    handleModal,
    chat_id,
    participant_email,
    participant_type,
    refreshData
}) => {
    const elevateParticipant = useAppStore((state) => state.elevateParticipantToAdmin);
    const removeParticipant = useAppStore((state) => state.removeGroupChatParticipant);
    const handleElevate = async () => {
        const response = await elevateParticipant("user", Number(chat_id), participant_email, participant_type);
        if (response === true) {
            handleModal();
            refreshData();
        } else {
            Alert.alert("Error", "Participant not elevated to admin",
                [
                    {
                        text: "Ok",
                        onPress: () => handleModal(),
                    }
                ], {cancelable: false}
            );
        }
    }

    const handleRemove = async () => {
        const response = await removeParticipant(Number(chat_id), participant_email, participant_type);
        if (response === true) {
            handleModal();
            refreshData();
        } else {
            Alert.alert("Error", "Participant not removed",
                [
                    {
                        text: "Ok",
                        onPress: () => handleModal(),
                    }
                ], {cancelable: false}
            );
        }
    }


    return (
        <View>
            <Modal 
                animationType='fade'
                transparent={true}
                visible={true}
                onRequestClose={handleModal}
            >
                <Pressable style={styles.modalBackground} onPressOut={handleModal}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            {/* Promote to admin */}
                            <TouchableOpacity style={styles.promoteContainer} onPress={handleElevate}>
                                <Icon name={'magic'} color={'gray'} size={22} style={styles.icon}/>
                                <Text style={styles.text}>{Constants.promote}</Text>
                            </TouchableOpacity>
                            {/* Remove from group */}
                            <TouchableOpacity style={styles.promoteContainer} onPress={handleRemove}>
                                <Icon name={'user-times'} color={'gray'} size={22} style={styles.icon}/>
                                <Text style={styles.text}>{Constants.remove}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Pressable>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    modalContainer: {
        width: "60%",
        backgroundColor: "white",
        borderRadius: 10,
    },
    promoteContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        flexDirection: "row",
    },
    icon: {
        flex: 0.25,
        textAlign: "center",
    },
    text: {
        flex: 0.75,
        textAlign: "left",
    }
});

export default ChatDetailsPopUp;