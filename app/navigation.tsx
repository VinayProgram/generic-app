import React from "react";
import Login from "./login/login";
import SignupScreen from ".";
import { Stack } from "expo-router";
import { AuthProvider } from "./authProvider";
// Define Stack Navigator

const Navigation = () => {
  return (

    <Stack>
    <Stack.Screen name="(home)" />
    <Stack.Screen name="login" options={{ title: "Login" }} />
    <Stack.Screen name="/" options={{ title: "Signup" }} />
  </Stack>
   
  );
};

export default Navigation;
