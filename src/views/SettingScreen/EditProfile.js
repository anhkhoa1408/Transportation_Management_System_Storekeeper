import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { COLORS } from '../../styles';
import authApi from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { store } from '../../config/configureStore';
import { useFormik } from 'formik';
import * as Bonk from 'yup';
import { saveInfo } from '../../actions/actions';
import ModalMess from '../../components/ModalMess';
import { Avatar, Icon, Button } from 'react-native-elements';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/CustomButton/PrimaryButton';
import Loading from '../../components/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { getAvatarFromUri, getAvatarFromUser } from '../../utils/avatarUltis';
import { MAIN_URL } from '../../api/config';

const EditProfile = ({ navigation }) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { userInfo } = store.getState();
  const [avatar, setAvatar] = useState(getAvatarFromUser(userInfo?.user));
  const [dataChange, setDataChange] = useState(true);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: Bonk.object({
      name: Bonk.string().required('Thông tin bắt buộc'),
      email: Bonk.string()
        .required('Thông tin bắt buộc')
        .email('Email không hợp lệ'),
      phone: Bonk.string().required('Thông tin bắt buộc'),
    }),
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUser(userInfo);
      setData({
        ...data,
        name: userInfo.user.name,
        email: userInfo.user.email,
        phone: userInfo.user.phone,
      });
      setDataChange(false);
      setDataChange(true);
    });
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = values => {
    setLoading(true);
    authApi
      .update(user.user.id, values)
      .then(response => {
        setLoading(false);
        dispatch(saveInfo({ user: response }));
        setAlert({
          type: 'success',
          message: 'Cập nhật thông tin thành công',
        });
      })
      .catch(err => {
        setLoading(false);
        setAlert({
          type: 'danger',
          message: 'Cập nhật thông tin thất bại',
        });
      });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {alert && (
        <ModalMess
          type={alert.type}
          message={alert.message}
          setAlert={setAlert}
          alert={alert}
        />
      )}
      {loading && <Loading />}
      <Header
        leftElement={
          <Icon name="west" size={30} onPress={() => navigation.goBack()} />
        }
        headerText="Thông tin cá nhân"
      />

      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        contentContainerStyle={{ padding: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Avatar
            size={150}
            source={{
              uri: avatar,
            }}
            rounded>
            <Avatar.Accessory
              underlayColor="#CCC"
              style={{ backgroundColor: COLORS.primary }}
              color={COLORS.white}
              onPress={() =>
                launchImageLibrary({
                  mediaTypes: 'photo',
                  quality: 1,
                }).then(data => {
                  if (data.assets && data.assets.length > 0) {
                    setLoading(true);
                    authApi
                      .updateAvatar(data.assets[0])
                      .then(response => {
                        setLoading(false);
                        dispatch(saveInfo({ user: response }));
                        setAlert({
                          type: 'success',
                          message: 'Cập nhật ảnh đại diện thành công',
                        });
                        setAvatar(getAvatarFromUri(response.avatar.url))
                      })
                      .catch(err => {
                        console.error(err);
                        setLoading(false);
                        setAlert({
                          type: 'danger',
                          message: 'Cập nhật ảnh đại diện thất bại',
                        });
                      });
                  }
                })
              }
              size={35}
            />
          </Avatar>
        </View>

        <TextField
          title="Tên"
          onChangeText={text => {
            formik.setFieldValue('name', text);
          }}
          onBlur={() => formik.setFieldTouched('name')}
          error={formik.touched.name && formik.errors.name}
          value={formik.values.name}
          errorMessage={formik.errors.name}
        />

        <TextField
          title="Email"
          value={formik.values.email}
          onChangeText={text => formik.setFieldValue('email', text)}
          onBlur={() => formik.setFieldTouched('email')}
          error={formik.touched.email && formik.errors.email}
          errorMessage={formik.errors.email}
        />

        <TextField
          keyboardType="numeric"
          title="Số điện thoại"
          value={formik.values.phone}
          onBlur={() => formik.setFieldTouched('phone')}
          onChangeText={text => formik.setFieldValue('phone', text)}
          error={formik.touched.phone && formik.errors.phone}
          errorMessage={formik.errors.phone}
        />

        <PrimaryButton
          title="CẬP NHẬT"
          containerStyle={{ marginTop: 30 }}
          onPress={formik.submitForm}
          backgroundColor={COLORS.success}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});
