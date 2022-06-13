import { Text, View } from "react-native";
import React from "react";
import { SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useTheme } from "../../../ThemeContext";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../../firebase-config";
import { useEffect } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons/";

const AdminPanel = ({ navigation }) => {
  const colRef = collection(db, "Users");
  const { unauthorizedUsers, setUnauthorizedUsers } = useAppContext();
  const { allUsers, setAllUsers } = useAppContext();
  const { theme, styleVariables } = useTheme();

  const getCount = async () => {
    const data = await getDocs(colRef);
    const users = data.docs.map((user) => {
      let userDocId = user._key.path.segments[6];

      return (user = {
        ...user.data(),
        userDocId,
      });
    });

    setAllUsers(users.filter((user) => user.tenantAuthorized));
    setUnauthorizedUsers(users.filter((user) => !user.tenantAuthorized));
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <SafeAreaView style={[theme.pageContainer, { flex: 1 }]}>
      <StatusBar style="auto" />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ApproveUsers", {
            unauthorizedUsers,
          });
        }}
        style={[theme.cardButton, { marginTop: 27, shadowRadius: 22 }]}
      >
        <View id="title" style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="person-add"
            size={36}
            color={styleVariables.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >{`Approve users`}</Text>
        </View>

        <View id="counter" style={theme.counter}>
          <Text
            id="notificationCounter"
            style={[
              theme.notificationCounter,
              styleVariables.fontSizes.callout,
              { color: styleVariables.colors.white },
            ]}
          >
            {unauthorizedUsers && unauthorizedUsers.length}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={styleVariables.colors.primary}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ManageUsers", { allUsers });
        }}
        style={theme.cardButton}
      >
        <View id="title" style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="account-cog"
            size={36}
            color={styleVariables.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Manage users
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ManageBuildings");
        }}
        style={theme.cardButton}
      >
        <View id="title" style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="home-work"
            size={36}
            color={styleVariables.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Manage buildings
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SendNotice");
        }}
        style={theme.cardButton}
      >
        <View id="title" style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="markunread-mailbox"
            size={36}
            color={styleVariables.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Send notices
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CreateAnnouncement");
        }}
        style={theme.cardButton}
      >
        <View id="title" style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="bullhorn"
            size={36}
            color={styleVariables.colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styleVariables.fontSizes.title,
              { color: styleVariables.colors.primary },
            ]}
          >
            Create announcement
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={styleVariables.colors.primary}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminPanel;
