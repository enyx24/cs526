import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { loadExpenseCategories } from '../database/category';

const CategoryDropdown = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);

  // Load categories từ database khi component mount
  useEffect(() => {
    loadExpenseCategories((fetchedCategories) => {
      // Chuyển đổi đối tượng thành mảng
      const formattedCategories = fetchedCategories.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      console.log('Formatted Categories:', formattedCategories);
      setCategories(formattedCategories); // Cập nhật danh mục vào state
    });
  }, []);

  return (
    <View style={{ padding: 0 }}>
      <RNPickerSelect
        onValueChange={onChange} // Gọi hàm onChange từ props
        value={value} // Truyền giá trị từ props
        items={categories} // Truyền danh sách categories vào RNPickerSelect
        placeholder={{
          label: 'Chọn danh mục',
          value: null,
        }}
      />
    </View>
  );
};

export default CategoryDropdown;
