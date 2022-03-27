import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../ThemeContext';
import { useAppContext } from '../../../Context/AppContext';

const AdminPanel = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [theme, styleVariables] = useTheme();
  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ApproveUsers');
        }}
        style={theme.primaryButton}
      >
        <Text>Approve users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ManageUsers');
        }}
        style={theme.primaryButton}
      >
        <Text>Manage users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SendNotice');
        }}
        style={theme.primaryButton}
      >
        <Text>Send notices</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ManageBuildings');
        }}
        style={theme.primaryButton}
      >
        <Text>Manage buildings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminPanel;
