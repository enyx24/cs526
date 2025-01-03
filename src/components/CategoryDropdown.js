import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { loadExpenseCategories } from '../database/category';

const CategoryDropdown = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [placeholderCounter, setPlaceholderCounter] = useState(0); // Đếm số lần thay đổi giá trị

  // Load categories từ database khi component mount
  useEffect(() => {
    loadExpenseCategories((fetchedCategories) => {
      const formattedCategories = fetchedCategories.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      // console.log('Formatted Categories:', formattedCategories);
      setCategories(formattedCategories);
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
        items={categories}
        style={{
          placeholder: {
            color: 'red', // Màu của placeholder
          }}
        }
        placeholder={
          placeholderCounter <= 2
            ? { label: 'Chọn danh mục', value: '' } // Hiển thị placeholder lần đầu
            : {} // Không hiển thị placeholder sau lần đầu
        }
      />
    </View>
  );
};

export default CategoryDropdown;
