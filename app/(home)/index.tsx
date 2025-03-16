import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../authProvider";


const HomeScreen = () => {
  const { user, userData, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {userData?.name || user?.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
