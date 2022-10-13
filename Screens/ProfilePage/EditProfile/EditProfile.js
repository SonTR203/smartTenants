//https://www.youtube.com/watch?v=aSOsfpsMriI
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../../ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useAppContext } from "../../../Context/AppContext";
import DynamicProfilePicture from "../../../components/ProfilePicture/DynamicProfilePicture";
import EditActions from "./EditActions";
import PopupModal from "../../../components/PopupModal";

const EditProfile = ({ route, navigation }) => {
  const { currentUser } = useAppContext();
  const { theme, styleVariables } = useTheme();
  const [toastVisible, setToastVisible] = useState(false);
  const displayModal = () => {
    if (route.params?.immediately)
      return setToastVisible(route.params?.saveModal === true ? true : false);
    window.setTimeout(() => {
      return setToastVisible(route.params?.saveModal === true ? true : false);
    }, 400);
  };

  useEffect(() => {
    displayModal();
  }, [route.params]);
  const styles = (styleVariables) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: styleVariables.colors.primary,
      },
      colorPrimary: {
        color: styleVariables.colors.primary,
      },
      topCard: {
        elevation: Platform.OS === "android" ? 0 : 20,
        borderTopLeftRadius: 27,
        borderTopRightRadius: 27,
        marginBottom: 8,
      },
      headerSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 24,
      },
      userImageContainer: {
        borderRadius: 99,
        shadowColor: styleVariables.colors.black,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.14,
        shadowRadius: 17,
        elevation: 20,
        backgroundColor: "white",
      },
      fullNameText: { paddingTop: 17, paddingBottom: 8 },
    });
  return (
    <SafeAreaView edges={["top"]}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          style={[theme.pageContainer, theme.globalMargins, theme.fullHeight]}>
          <StatusBar style="dark" />
          <Modal
            animationType="slide"
            transparent={true}
            // statusBarTranslucent={true}
            visible={route.params?.saveModal === true ? true : false}
            onRequestClose={() => {
              navigation.setParams({
                saveModal: false,
              });
            }}
            onShow={() => {
              setTimeout(() => {
                navigation.setParams({
                  saveModal: false,
                });
              }, 2000);
            }}>
            <PopupModal
              modalType={route.params?.modalType}
              message={route.params?.message}
              hideModal={() => {
                navigation.setParams({
                  saveModal: false,
                  reload: null,
                });
              }}
            />
          </Modal>
          <View style={[theme.topCard, styles(styleVariables).topCard]}>
            <View style={styles(styleVariables).headerSection}>
              {/* userImage */}
              <View
                id="userImage"
                style={styles(styleVariables).userImageContainer}>
                <DynamicProfilePicture
                  user={{
                    userProfileImage: currentUser.userProfileImage,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    colors: currentUser.colors,
                  }}
                  size={88}
                  borderRadius={16}
                />
              </View>
              {/* userFullName */}
              <Text
                id="userFullName"
                style={[
                  styleVariables.fontSizes.header,
                  styles(styleVariables).fullNameText,
                  {
                    color: styleVariables.colors.black,
                  },
                ]}>
                {`${currentUser.firstName} ${currentUser.lastName}`}
              </Text>
            </View>
          </View>
          <EditActions navigation={navigation} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
