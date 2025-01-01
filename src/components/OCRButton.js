import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook

const OCRButton = () => {
    const navigation = useNavigation();  // Use navigation hook

    const handlePress = () => {
        // Điều hướng đến màn hình HomeScreen khi OCRButton được nhấn
        navigation.navigate('Nhập vào');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.button}>
                <Image source={require('../imgs/ocrlogo.png')} style={styles.image} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',  // Đặt vị trí tuyệt đối cho OCRButton
        bottom: 10,  // Cách đáy màn hình một khoảng
        left: '50%',  // Căn giữa trên màn hình
        transform: [{ translateX: -30 }],  // Căn giữa chính xác (vì ảnh 60x60, chỉnh lại khoảng cách)
        zIndex: 10,  // Đảm bảo OCRButton nằm trên Navigation bar
    },
    button: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00A2E8', // Bạn có thể thêm màu nền nếu muốn
        borderRadius: 30,
    },
    image: {
        width: 50,
        height: 50,
    },
});

export default OCRButton;
