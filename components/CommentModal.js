import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Platform,
} from "react-native";
import Modal from "react-native-modal";

const styles = StyleSheet.create({});

export default function CommentModal() {
  // Keep Modal in View all the time
  const [isModalVisible, setIsModalVisible] = React.useState(true);

  return <Text>CommentModal</Text>;
}
