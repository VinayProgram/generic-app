import React from "react";
import Login from "./login/login";
import SignupScreen from ".";
import { Stack } from "expo-router";
// Define Stack Navigator

const Navigation = () => {
  return (
    <Stack>
    <Stack.Screen name="index" options={{ title: "Home" }} />
    <Stack.Screen name="login" options={{ title: "Login" }} />
    <Stack.Screen name="signup" options={{ title: "Signup" }} />
  </Stack>
   
  );
};

export default Navigation;
