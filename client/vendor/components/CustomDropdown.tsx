import { ThemedText } from "./ThemedText";
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity } from 'react-native';

export function CustomDropdown({ list, handleSelect, value, onChange, isDisplay }: any) {

  return (
    <View>
      <TextInput
        placeholder="Category"
        style={styles.input}
        value={value}
        onChangeText={(value: any) => onChange(value)}
      />
      {
        isDisplay > 0 && (
          <View style={[styles.dropdown]}>
            <FlatList
              data={list}
              keyExtractor={(item: any, index: number) => `${item}-${index}`}
              renderItem={({ item }: any) => (
                <TouchableOpacity onPress={() => handleSelect(item)} style={[styles.item, {zIndex: 999}]}>
                  <ThemedText style={{color: 'black'}}>{item}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'white'
  },
  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 999
  }  
});
