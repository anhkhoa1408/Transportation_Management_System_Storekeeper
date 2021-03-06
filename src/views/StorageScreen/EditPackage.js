import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { container } from '../../styles/layoutStyle';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import CustomInput from '../../components/CustomInput/CustomInput';
import { COLORS } from '../../styles';
import Select from '../../components/Select/Select';
import * as Bonk from 'yup';
import { useFormik } from 'formik';
import storageApi from '../../api/storageApi';
import packageApi from '../../api/packageApi';
import ModalMess from './../../components/ModalMess';
import Loading from './../../components/Loading';
import PrimaryButton from '../../components/CustomButton/PrimaryButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditPackage = ({ navigation, route }) => {
  const { type } = route?.params;

  const [item, setItem] = useState(route?.params?.item);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(null);
  const [selected, setSelected] = useState(item.package_type);

  const [data, setData] = useState([
    {
      label: 'Thông thường',
      value: 'normal',
    },
    {
      label: 'Dễ vỡ',
      value: 'fragile',
    },
    {
      label: 'Dễ cháy nổ',
      value: 'explosive',
    },
    {
      label: 'Có mùi',
      value: 'smell',
    },
  ]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...item,
      len: item.size.len,
      width: item.size.width,
      height: item.size.height,
      importedQuantity: item.importedQuantity,
    },
    validationSchema: Bonk.object({
      position: Bonk.string().required('Thông tin bắt buộc'),
      len: Bonk.string().required('Thông tin bắt buộc'),
      width: Bonk.string().required('Thông tin bắt buộc'),
      height: Bonk.string().required('Thông tin bắt buộc'),
      height: Bonk.string().required('Thông tin bắt buộc'),
      weight: Bonk.string().required('Thông tin bắt buộc'),
      quantity: Bonk.string().required('Thông tin bắt buộc'),
    }),
    validateOnBlur: true,
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = values => {
    setLoading(<Loading />);

    packageApi
      .editPackage(values.id, {
        ...values,
        package_type: selected,
      })
      .then(response => {
        setItem({
          ...values,
          ...response,
        });
        setLoading(null);
        setAlert({
          type: 'success',
          message: 'Cập nhật thông tin thành công',
        });
      })
      .catch(errors => {
        setLoading(null);
        setAlert({
          type: 'danger',
          message: 'Cập nhật thông tin thất bại',
        });
      });
  };

  return (
    <SafeAreaView style={style.container}>
      {loading}
      {alert && (
        <ModalMess
          alert={alert}
          setAlert={setAlert}
          message={alert.message}
          type={alert.type}
        />
      )}
      <Header
        leftElement={
          <Icon name="west" size={30} onPress={() => navigation.goBack()} />
        }
        headerText={'Chi tiết kiện hàng'}
        rightElement={
          <Icon
            name="qr-code-scanner"
            size={30}
            color={COLORS.primary}
            onPress={() => {
              navigation.navigate('QRDetail', {
                ...route.params,
                qr: item.id,
              });
            }}
          />
        }
      />
      <KeyboardAwareScrollView enableAutomaticScroll enableOnAndroid>
        <ScrollView contentContainerStyle={style.form}>
          <TextField title="Mã QR" disabled value={formik.values.id} />
          <TextField
            editable={false}
            title="Tên kiện hàng"
            disabled
            value={formik.values.name}
          />
          <TextField
            title="Vị trí đặt hàng"
            value={formik.values.position}
            error={formik.touched.position && formik.errors.position}
            errorMessage={formik.errors.position}
            onChangeText={text => formik.setFieldValue('position', text)}
            onBlur={() => formik.setFieldTouched('position')}
          />

          <TextField
            title="Chiều dài"
            afterText="cm"
            keyboardType="numeric"
            value={formik.values.len.toString()}
            error={formik.touched.len && formik.errors.len}
            errorMessage={formik.errors.len}
            onChangeText={text => formik.setFieldValue('len', text)}
            onBlur={() => formik.setFieldTouched('len')}
          />

          <TextField
            title="Chiều rộng"
            afterText="cm"
            keyboardType="numeric"
            value={formik.values.width.toString()}
            error={formik.touched.width && formik.errors.width}
            errorMessage={formik.errors.width}
            onChangeText={text => formik.setFieldValue('width', text)}
            onBlur={() => formik.setFieldTouched('width')}
          />

          <TextField
            title="Chiều cao"
            afterText="cm"
            keyboardType="numeric"
            value={formik.values.height.toString()}
            error={formik.touched.height && formik.errors.height}
            errorMessage={formik.errors.height}
            onChangeText={text => formik.setFieldValue('height', text)}
            onBlur={() => formik.setFieldTouched('height')}
          />

          <TextField
            title="Cân nặng"
            afterText="kg"
            keyboardType="numeric"
            value={formik.values.weight.toString()}
            error={formik.touched.weight && formik.errors.weight}
            errorMessage={formik.errors.weight}
            onChangeText={text => formik.setFieldValue('weight', text)}
            onBlur={() => formik.setFieldTouched('weight')}
          />

          {!type && (
            <TextField
              disabled
              title="Số lượng trong kho"
              afterText="kiện"
              keyboardType="numeric"
              value={formik.values.importedQuantity.toString()}
            />
          )}

          <TextField
            title="Tổng số lượng"
            afterText="kiện"
            keyboardType="numeric"
            value={formik.values.quantity.toString()}
            error={formik.touched.quantity && formik.errors.quantity}
            errorMessage={formik.errors.quantity}
            onChangeText={text => formik.setFieldValue('quantity', text)}
            onBlur={() => formik.setFieldTouched('quantity')}
          />

          <Select
            data={data}
            selected={selected}
            setSelected={setSelected}
            title="Loại"
          />
          <PrimaryButton title="Lưu" onPress={formik.submitForm} />
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    ...container,
    alignItems: 'stretch',
  },
  input: {
    padding: 15,
    backgroundColor: '#FFF',
  },
  form: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
});

export default EditPackage;
