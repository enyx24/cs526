import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, PermissionsAndroid, Platform, Alert, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import MlkitOcr from 'react-native-mlkit-ocr';
import { launchImageLibrary } from 'react-native-image-picker';
import CategoryDropdown from '../components/CategoryDropdown';
import SourceDropdown from '../components/SourceDropdown';
import { addTransaction } from '../database/transaction';
import { updateSourceAmount, getSourceIdByName } from '../database/source';
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


const normalizeDate = (date) => {
  // Tách ngày, tháng, năm từ chuỗi và sắp xếp lại theo thứ tự năm-tháng-ngày
  const parts = date.split('/');
  if (parts.length === 3) {
    // Kiểm tra xem chuỗi có đúng định dạng ngày/tháng/năm
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return date; // Trả lại chuỗi gốc nếu không phải định dạng ngày/tháng/năm
};


const normalizeMoney = (money) => {
  // Lọc ra chỉ những ký tự số, đồng thời loại bỏ các ký tự không cần thiết (chữ cái, dấu chấm, khoảng trắng, v.v.)
  return money.replace(/[^0-9]/g, '');
};


const OCRScreen = () => {
  
  const [images, setImages] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null); // Trạng thái lưu ảnh đang được phóng to
  useEffect(() => {
    if (images && images.length > 0) {
      handleOCRButtonPress();
    }
  }, [images]);
  // const [categoryValue, setCategoryValue] = useState(null); // Giá trị của CategoryDropdown
  // const [sourceValue, setSourceValue] = useState(null);  // Giá trị của SourceDropdown


  // const handleCategoryChange = (value, index) => {
  //   console.log('Category Value:', value, ' index: ',index);
  //   const temp = [...extractedInfo];
  //   temp[index].category = value;
  //   setExtractedInfo(temp);
  // };

  // const handleSourceChange = (value, index) => {
  //   const temp = [...extractedInfo];
  //   temp[index].source = value;
  //   setExtractedInfo(temp);
  // };

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
        money: extractedMoney ? normalizeMoney(extractedMoney[0]) : '',
        senderReceiver: extractedSenderReceiver ? extractedSenderReceiver[0] : '',
        time: (extractedTime[(extractedTime.length == 1)? 0 : 1]) ? (extractedTime[(extractedTime.length == 1)? 0 : 1]) : '',
        date: extractedDate ? normalizeDate(extractedDate[0]) : '',
        type: 0,
        category: '',
        source: '',
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

  const handleDeleteImage = (index) => {
    console.log('Deleting image:', index);
    const updatedImages = images.filter((_, i) => i !== index); // Xóa ảnh khỏi mảng
    const updatedExtractedInfo = extractedInfo.filter((_, i) => i !== index); // Xóa thông tin trích xuất khỏi mảng
    setImages(updatedImages); // Cập nhật mảng ảnh
    setExtractedInfo(updatedExtractedInfo); // Cập nhật thông tin trích xuất
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
            {/* Nút xóa ở góc trên bên phải */}
            <View style={{ position: 'absolute', top: 15, left: 20 }}>
              <Button 
                style={{ color: 'white', fontWeight: 'bold'}} 
                title='Xoá'
                onPress={() => handleDeleteImage(index)}/>
            </View>
            {/* Hiển thị ảnh với tính năng nhấn giữ */}
            <TouchableOpacity 
              onLongPress={() => handleLongPress(image.uri)} // Khi nhấn giữ
            >
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: zoomedImage === image.uri ? screenWidth * 0.9 : 225 * 0.9, // Phóng to ảnh nếu được chọn
                  height: zoomedImage === image.uri ? screenHeight * 0.9 : 400 * 0.9, // Phóng to ảnh nếu được chọn
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Nếu có ảnh đang phóng to thì hiển thị thông tin đóng */}
            {zoomedImage && (
              <View style={{ bottom: screenHeight * 0.15, flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <Button title="Đóng" onPress={handleCloseZoom} style={{ flex: 1 }} />
              </View>
            )}

            {/* Hiển thị thông tin trích xuất */}
            {(!zoomedImage) && (
              <>
                <View style={{ width: '100%' }}>
                  <Text style={{ fontWeight: 'bold' }}>Ngày:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    value={extractedInfo[index]?.date ? extractedInfo[index].date : ''}
                    onChangeText={(text) => {
                      const updatedInfo = [...extractedInfo];
                      updatedInfo[index].date = text;
                      setExtractedInfo(updatedInfo);
                    }} 
                  />

                  <Text style={{ fontWeight: 'bold' }}>Ghi chú:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    value={extractedInfo[index]?.time ? extractedInfo[index].time : ''}
                    onChangeText={(text) => {
                      const updatedInfo = [...extractedInfo];
                      updatedInfo[index].time = text;
                      setExtractedInfo(updatedInfo);
                    }} 
                  />

                  <Text style={{ fontWeight: 'bold' }}>Số tiền:</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                    value={extractedInfo[index]?.money ? extractedInfo[index].money : ''}
                    onChangeText={(text) => {
                      const updatedInfo = [...extractedInfo];
                      updatedInfo[index].money = text;
                      setExtractedInfo(updatedInfo);
                    }} 
                  />

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <View style={{flex: 1}}>
                      <Text style={{ fontWeight: 'bold' }}>Danh mục:</Text>
                      <CategoryDropdown 
                        value={extractedInfo[index]?.category ? extractedInfo[index].category : ''}
                        onChange={(value) => {
                          const updatedInfo = [...extractedInfo];
                          if (updatedInfo[index]) {
                            updatedInfo[index].category = value;
                            setExtractedInfo(updatedInfo);
                          }
                          else {
                            console.log('NO CATEGORY');
                          }
                        }}   
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{ fontWeight: 'bold' }}>Nguồn:</Text>
                      <SourceDropdown 
                        value={extractedInfo[index]?.source ? extractedInfo[index].source : ''}
                        onChange={(value) => {
                          const updatedInfo = [...extractedInfo];
                          if (updatedInfo[index]) {
                            updatedInfo[index].source = value;
                            setExtractedInfo(updatedInfo);
                          }
                          else {
                            console.log('NO SOURCE');
                          }
                        }} 
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
      {!zoomedImage && (
        <View style={{ bottom: 20, flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
            <Button title="Chọn ảnh" onPress={selectImages} />
          </View>
          {/* <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
            <Button title="Thực hiện OCR" onPress={handleOCRButtonPress} />
          </View> */}
        </View>
      )}
      {images.length > 0 && !zoomedImage && (
        <View style={{ right: 20, top: 15, position: 'absolute' }}>
          <Button
            title="Xong"
            onPress={() => {
              console.log('Tui bị ngu');
              let successCount = 0; // Đếm số giao dịch thành công
              let failureCount = 0; // Đếm số giao dịch thất bại

              extractedInfo.forEach((info, index) => {
                // Kiểm tra nếu giá trị category và source bị trống thì không thêm vào
                // console.log('Category:', categoryValue);
                // console.log('Source:', sourceValue);
                if (!info?.date || !info?.money || !info?.category || !info?.category) {
                  failureCount++; // Nếu thiếu thông tin, coi như thất bại
                  return;
                }
                
                if (info.date == '' || info.money == '' || info.category == '' || info.category == '') {
                  failureCount++; // Nếu thiếu thông tin, coi như thất bại
                  return;
                }

                const transaction = {
                  date: info?.date || '',
                  note: info?.time || '',
                  source: info?.source, // Dùng giá trị từ trạng thái source
                  amount: info?.money || '',
                  type: 0, // Set type = 0
                  category: info.category, // Dùng giá trị từ trạng thái category
                };
                console.log('Adding transaction:', transaction);

                // Gọi hàm addTransaction và truyền callback cho thành công và lỗi
                addTransaction(
                  transaction,
                  () => {
                    // successCount++; // Tăng số lượng giao dịch thành công
                    console.log(`Transaction ${index + 1} added successfully`);
                    handleDeleteImage(index); // Xóa ảnh sau khi thêm giao dịch thành công
                    getSourceIdByName(
                      transaction.source, // ID của nguồn
                      (source) => {
                        if (source) {
                          // Tính toán số tiền mới
                          const newAmount = parseInt(source.amount, 10) - transaction.amount;

                          // Cập nhật số tiền mới vào nguồn
                          updateSourceAmount(
                            source.id, // ID của nguồn
                            newAmount, // Số tiền mới sau khi trừ
                            () => {
                              console.log(`Updated source amount for ${transaction.source}`);
                            },
                            (error) => {
                              console.log('Error updating source amount:', error);
                            }
                          );
                        } else {
                          console.log(`Source with ID ${transaction.source} not found`);
                        }
                      },
                      (error) => {
                        console.log('Error fetching source by ID:', error);
                      }
                    );
                  },
                  (error) => {
                    failureCount++; // Tăng số giao dịch thất bại
                    console.log('Error adding transaction:', error);
                  }
                );
              });

              // Hiển thị thông báo khi hoàn tất
              if (failureCount === 0) {
                Alert.alert(
                  'Kết quả thêm giao dịch',
                  'Tất cả giao dịch đã được thêm thành công.',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Kết quả thêm giao dịch',
                  `${failureCount} giao dịch không thể thêm do thiếu thông tin.`,
                  [{ text: 'OK' }]
                );
              }
            }}
          />

        </View>
      )}
    </>
  );
};

export default OCRScreen;

