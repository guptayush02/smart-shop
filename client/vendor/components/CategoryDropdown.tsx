// import { useCallback, useEffect, useState } from 'react';
// import { ThemedText } from "./ThemedText";
// import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
// import httpRequest from '@/helpers/httpRequests';
// import { ThemedView } from './ThemedView';
// import { CustomDropdown } from './CustomDropdown';
// import { getData, saveData } from '@/helpers/expoSecureStore';
// import { useFocusEffect } from '@react-navigation/native';

// export function CategoriesDropdown({ isLogin, getQuery }: any) {
//   const [category, setCategory] = useState('');
//   const [categoryList, setCategoryList] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       const getCategory = async() => {
//         const vendorCategory = await getData('category');
//         setCategory(vendorCategory);
//       };

//       getCategory();
//     }, [])
//   )

//   const onCategoryChange = (value:string) => {
//     setShowDropdown(true)
//     setCategory(value);
//     getCategoryList(value);
//   }

//   const getCategoryList = async(value:string) => {
//     const result: any = await httpRequest.get(`api/v1/vendor/categories?category=${value}`);
//     if (result.status === 200) {
//       setCategoryList(result.data.data);
//     }
//   }

//   const handleSelectedCategory = async(item:any) => {
//     const result: any = await httpRequest.post(`api/v1/vendor/category`, { item });
//     if (result.status === 200) {
//       setShowDropdown(false);
//       setCategory(item);
//       saveData('category', item);
//       getQuery()
//     }
//   }

//   return (
//     <View>
//       {
//         isLogin && (
//           <View style={styles.categoryWrapper}>
//             <CustomDropdown list={categoryList} handleSelect={handleSelectedCategory} value={category} onChange={onCategoryChange} isDisplay={showDropdown} />
//           </View>
//         )
//       }
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 28,
//     lineHeight: 32,
//     marginTop: -6,
//   },
//   header: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     height: '100%',
//     alignItems: 'center',
//     padding: '20px'
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     width: '100%',
//     backgroundColor: 'white'
//   },
//   categoryWrapper: {
//     position: 'relative',
//     width: 200,
//   },
  
//   dropdown: {
//     position: 'absolute',
//     top: 38,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     maxHeight: 150,
//     zIndex: 999,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
  
//   item: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     zIndex: 999
//   }  
// });

import { useCallback, useEffect, useState } from 'react';
import { ThemedText } from "./ThemedText";
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedView } from './ThemedView';
import { CustomDropdown } from './CustomDropdown';
import { getData, saveData } from '@/helpers/expoSecureStore';
import { useFocusEffect } from '@react-navigation/native';

export function CategoriesDropdown({ isLogin, getQuery }: any) {
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getCategory = async () => {
        const vendorCategory = await getData('category');
        if (vendorCategory) {
          setCategory(vendorCategory);
          getCategoryList(vendorCategory);
        }
      };
      getCategory();
    }, [])
  );

  const onCategoryChange = (value: string) => {
    setShowDropdown(true);
    setCategory(value);
    getCategoryList(value);
  };

  const getCategoryList = async (value: string) => {
    try {
      const result: any = await httpRequest.get(`api/v1/vendor/categories?category=${value}`);
      if (result.status === 200) {
        setCategoryList(result.data.data);
      }
    } catch (e) {
      // Handle error if required
    }
  };

  const handleSelectedCategory = async (item: any) => {
    try {
      const result: any = await httpRequest.post(`api/v1/vendor/category`, { item });
      if (result.status === 200) {
        setShowDropdown(false);
        setCategory(item);
        saveData('category', item);
        getQuery();
      }
    } catch (e) {
      // Handle error if required
    }
  };

  // Render dropdown list item
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectedCategory(item)} activeOpacity={0.7}>
      <ThemedText style={styles.dropdownItemText}>{item}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View>
      {isLogin && (
        <View style={styles.categoryWrapper}>
          {/* Selected or entered category input */}
          <TextInput
            style={styles.input}
            value={category}
            placeholder="Select Category"
            onChangeText={onCategoryChange}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && categoryList.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={categoryList}
                keyExtractor={(item, idx) => item + idx}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                style={{ maxHeight: 160 }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryWrapper: {
    position: 'relative',
    width: 220,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
});

