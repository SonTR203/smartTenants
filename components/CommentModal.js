import * as React from "react";
import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({});

export default function CommentModal() {
  // Keep Modal in View all the time
  const [isModalVisible, setIsModalVisible] = React.useState(true);

  return <Text>CommentModal</Text>;
}
