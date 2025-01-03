import React, { useState } from 'react';
import { View, Text, Button, Image, ScrollView, PermissionsAndroid, Platform, Alert, Dimensions, TouchableOpacity, TextInput, useEffect } from 'react-native';
import MlkitOcr from 'react-native-mlkit-ocr';
import { launchImageLibrary } from 'react-native-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Lấy chiều rộng và chiều cao màn hình

const results = [];

// Hàm yêu cầu quyền truy cập ảnh
const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Storage Permission',
            message: 'Ứng dụng cần quyền để chọn ảnh.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'Đồng ý',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Ứng dụng cần quyền để chọn ảnh.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'Đồng ý',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS không cần runtime permission
};

const OCRScreen = () => {
  const [images, setImages] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null); // Trạng thái lưu ảnh đang được phóng to

  // Regex patterns
  const regexMoney = /(\b(?:VND\s*)?\d{1,3}(?:[.,]\d{3})*(?:\s*(?:VNĐ|đ|đồng|\sVNĐ|\sVND|VND|d|\sd)))/g;
  const regexSenderReceiver = /(người\s*(?:gửi|nhận):\s?([A-Za-zÀ-ÿ\s]+))/gi;
  const regexTime = /(\d{2}[:]\d{2})/g;
  const regexDate = /(\d{1,2}\/\d{1,2}\/\d{4})/g;

  const selectImages = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Quyền truy cập bị từ chối', 'Ứng dụng cần quyền để chọn ảnh.');
      return;
    }

    launchImageLibrary({ selectionLimit: 0, mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        Alert.alert('Lỗi', `Không thể chọn ảnh: ${response.errorMessage}`);
      } else if (response.assets) {
        console.log('Selected images:', response.assets);
        setImages(response.assets);
      }
    });
  };

  const performOCR = async (imageUri) => {
    try {
      const result = await MlkitOcr.detectFromUri(imageUri);
      return result;
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Lỗi OCR', `Không thể xử lý ảnh: ${error.message}`);
      return [];
    }
  };

  const removeSpacesBetweenNumbers = (input) => {
    return input.replace(/(\d)\s+(\d)/g, '$1$2');
  };

  const handleOCRButtonPress = async () => {
    if (images.length === 0) {
      Alert.alert('Không có ảnh', 'Hãy chọn ít nhất một ảnh trước khi thực hiện OCR.');
      return;
    }

    const extractedData = [];

    for (let image of images) {
      const ocrResult = await performOCR(image.uri);
      // console.log('OCR Result:', ocrResult);
      results.push(ocrResult);

      ocrResult.forEach(item => {
        item.text = removeSpacesBetweenNumbers(item.text); // Xóa khoảng trắng giữa các số
      });

      // Trích xuất văn bản từ OCR result
      const text = ocrResult.map(item => item.text).join(' '); // Nối tất cả văn bản lại
      console.log(text);
      // Thực hiện regex để trích xuất thông tin
      const extractedMoney = text.match(regexMoney);
      const extractedSenderReceiver = text.match(regexSenderReceiver);
      const extractedTime = text.match(regexTime);
      const extractedDate = text.match(regexDate);

      extractedData.push({
        money: extractedMoney ? extractedMoney[0] : '',
        senderReceiver: extractedSenderReceiver ? extractedSenderReceiver[0] : '',
        time: (extractedTime[(extractedTime.length == 1)? 0 : 1]) ? (extractedTime[(extractedTime.length == 1)? 0 : 1]) : '',
        date: extractedDate ? extractedDate[0] : '',
      });
    }

    setExtractedInfo(extractedData);  // Cập nhật thông tin trích xuất
    results = results.push(extractedData)
    Alert.alert('OCR Hoàn tất', 'Đã xử lý tất cả các ảnh.');
  };

  const handleLongPress = (imageUri) => {
    // Khi nhấn giữ, phóng to ảnh ra vừa màn hình
    setZoomedImage(imageUri);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null); // Đóng chế độ phóng to
  };

  return (
    <>
      <ScrollView 
        horizontal={true} 
        pagingEnabled={true} 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsHorizontalScrollIndicator={false}
      >
        {images.map((image, index) => (
          <View
            key={index}
            style={{
              width: screenWidth,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Hiển thị ảnh với tính năng nhấn giữ */}
            <TouchableOpacity 
              onLongPress={() => handleLongPress(image.uri)} // Khi nhấn giữ
            >
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: zoomedImage === image.uri ? screenWidth*0.9 : 225, // Phóng to ảnh nếu được chọn
                  height: zoomedImage === image.uri ? screenHeight*0.9 : 400, // Phóng to ảnh nếu được chọn
                  top: zoomedImage === image.uri ? screenHeight*0.2 : 0,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Nếu có ảnh đang phóng to thì hiển thị thông tin đóng */}
            {zoomedImage && (
              <View style={{ bottom: 40, flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <Button title="Đóng" onPress={handleCloseZoom} style={{ flex: 1 }} />
              </View>
            )}

            {/* Hiển thị thông tin trích xuất */}
            <View style={{ marginTop: 20, width: '100%' }}>
              {/* <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Thông tin trích xuất:</Text> */}
              {extractedInfo[index]?.money && (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  value={extractedInfo[index].money}
                  onChangeText={(text) => {
                    // Cập nhật thông tin trong mảng extractedInfo
                    const updatedInfo = [...extractedInfo];
                    updatedInfo[index].money = text;
                    setExtractedInfo(updatedInfo);
                  }}
                />
              )}
              {extractedInfo[index]?.senderReceiver && (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  value={extractedInfo[index].senderReceiver}
                  onChangeText={(text) => {
                    const updatedInfo = [...extractedInfo];
                    updatedInfo[index].senderReceiver = text;
                    setExtractedInfo(updatedInfo);
                  }}
                />
              )}
              {extractedInfo[index]?.time && (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  value={extractedInfo[index].time}
                  onChangeText={(text) => {
                    const updatedInfo = [...extractedInfo];
                    updatedInfo[index].time = text;
                    setExtractedInfo(updatedInfo);
                  }}
                />
              )}
              {extractedInfo[index]?.date && (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  value={extractedInfo[index].date}
                  onChangeText={(text) => {
                    const updatedInfo = [...extractedInfo];
                    updatedInfo[index].date = text;
                    setExtractedInfo(updatedInfo);
                  }}
                />
              )}
            </View>

          </View>
        ))}
      </ScrollView>
      {!zoomedImage && (
        <View style={{ bottom: 30, flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
            <Button title="Chọn ảnh" onPress={selectImages} />
          </View>
          <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
            <Button title="Thực hiện OCR" onPress={handleOCRButtonPress} />
          </View>
        </View>
      )}
    </>
  );
};

export default OCRScreen;

