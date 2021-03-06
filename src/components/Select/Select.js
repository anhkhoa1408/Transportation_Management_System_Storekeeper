import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import { primary } from '../../styles/color';

const Select = props => {
  let { data, selected, setSelected } = props;
  const [selectedItem, setSelectedItem] = useState(selected);
  return (
    <View style={styles.container}>
      {props.title && <Text style={styles.texttitle}>{props.title}</Text>}
      <View style={styles.inputView}>
        <Picker
          mode="dropdown"
          style={{ flex: 1, fontSize: 15, color: '#000' }}
          dropdownIconColor={primary}
          selectedValue={selectedItem}
          onValueChange={(itemValue, itemIndex) => {
            setSelected(itemValue);
            setSelectedItem(itemValue);
          }}>
          {data.map((item, index) => {
            return (
              <Picker.Item
                key={item.label}
                label={item.label}
                value={item.value}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  texttitle: {
    fontSize: 15,
    color: '#000000',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#F3F3FA',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 15,
  },
  fsize: {
    fontSize: 17,
    color: '#000',
    paddingLeft: 20,
    paddingVertical: 8,
  },
});
