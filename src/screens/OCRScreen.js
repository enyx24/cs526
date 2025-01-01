import React, { useState } from 'react';
import { View, Text, Button, Image, ScrollView, PermissionsAndroid, Platform, Alert } from 'react-native';
import MlkitOcr from 'react-native-mlkit-ocr';
import { launchImageLibrary } from 'react-native-image-picker';

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
        Alert.alert('Hủy chọn ảnh', 'Bạn đã hủy việc chọn ảnh.');
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
      // console.log(`OCR result for ${imageUri}:`, result);
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

    const results = [];
    const extractedData = [];

    for (let image of images) {
      const ocrResult = await performOCR(image.uri);
      results.push(ocrResult);

      ocrResult.forEach(item => {
        item.text = removeSpacesBetweenNumbers(item.text); // Xóa khoảng trắng giữa các số
      });

      // Trích xuất văn bản từ OCR result
      const text = ocrResult.map(item => item.text).join(' '); // Nối tất cả văn bản lại

      // Thực hiện regex để trích xuất thông tin
      const extractedMoney = text.match(regexMoney);
      const extractedSenderReceiver = text.match(regexSenderReceiver);
      const extractedTime = text.match(regexTime);
      const extractedDate = text.match(regexDate);

      console.log('Số tiền:', extractedMoney[0]);
      console.log('Người gửi và người nhận:', extractedSenderReceiver);
      console.log('Thời gian:', extractedTime[(extractedTime.length == 1)? 0 : 1]);
      console.log('Ngày:', extractedDate[0]);

      // Lưu kết quả trích xuất vào state
      extractedData.push({
        money: extractedMoney,
        senderReceiver: extractedSenderReceiver,
        time: extractedTime,
      });
    }

    setOcrResults(results);
    setExtractedInfo(extractedData);  // Cập nhật thông tin trích xuất
    Alert.alert('OCR Hoàn tất', 'Đã xử lý tất cả các ảnh.');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Chọn ảnh" onPress={selectImages} />
      <Button title="Thực hiện OCR" onPress={handleOCRButtonPress} />
      
      <View style={{ marginTop: 20 }}>
        {ocrResults.length > 0 && (
          <Text>OCR Kết quả:</Text>
        )}
        {ocrResults.map((result, index) => (
          <View key={index} style={{ marginTop: 10 }}>
            <Text>{`Kết quả ảnh ${index + 1}:`}</Text>
            {result.map((item, subIndex) => (
              <Text key={subIndex}>{item.text}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        {extractedInfo.length > 0 && (
          <Text>Thông tin trích xuất:</Text>
        )}
        {extractedInfo.map((info, index) => (
          <View key={index} style={{ marginTop: 10 }}>
            <Text>{`Kết quả ảnh ${index + 1}:`}</Text>
            {info.money && <Text>Số tiền: {info.money}</Text>}
            {info.senderReceiver && <Text>Người gửi/nhận: {info.senderReceiver}</Text>}
            {info.time && <Text>Thời gian: {info.time}</Text>}
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        {images.length > 0 && (
          <Text>Ảnh đã chọn:</Text>
        )}
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={{ width: 100, height: 100, margin: 5 }} />
        ))}
      </View>
    </ScrollView>
  );
};

export default OCRScreen;
