import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { loadSources } from '../database/source';

const SourceDropdown = ({ value, onChange }) => {
  const [sources, setSources] = useState([]);

  // Load sources từ database khi component mount
  useEffect(() => {
    loadSources((fetchedSources) => {
      // Chuyển đổi đối tượng thành mảng
      const formattedSources = fetchedSources.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      console.log('Formatted Sources:', formattedSources);
      setSources(formattedSources); // Cập nhật danh sách sources vào state
    });
  }, []);

  return (
    <View style={{ padding: 0 }}>
      <RNPickerSelect
        onValueChange={onChange} // Gọi hàm onChange từ props
        value={value} // Truyền giá trị từ props
        items={sources} // Truyền danh sách sources vào RNPickerSelect
        placeholder={{
          label: 'Chọn nguồn',
          value: '',
        }}
      />
    </View>
  );
};

export default SourceDropdown;
