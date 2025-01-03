import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { loadSources } from '../database/source';

const SourceDropdown = ({ value, onChange }) => {
  const [sources, setSources] = useState([]);
  const [placeholderCounter, setPlaceholderCounter] = useState(0);

  // Load sources từ database khi component mount
  useEffect(() => {
    loadSources((fetchedSources) => {
      // Chuyển đổi đối tượng thành mảng
      const formattedSources = fetchedSources.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      // console.log('Formatted Sources:', formattedSources);
      setSources(formattedSources); // Cập nhật danh sách sources vào state
    });
  }, []);

  return (
    <View style={{ padding: 0 }}>
      <RNPickerSelect
        onValueChange={(selectedValue) => {
          onChange(selectedValue); // Gọi hàm onChange từ props
          setPlaceholderCounter((prev) => prev + 1); // Tăng giá trị đếm
          console.log(placeholderCounter);
        }}
        value={value}
        items={sources}
        placeholder={
          placeholderCounter == sources.length
            ? { label: 'Chọn nguồn', value: '' } // Hiển thị placeholder lần đầu
            : {} // Không hiển thị placeholder sau lần đầu
        }
      />
    </View>
  );
};

export default SourceDropdown;
