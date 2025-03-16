import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { auth, db } from "./firebase/fb"; // Ensure correct Firebase import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

// Define navigation type
type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
};

const SignupScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Register User with Email & Password
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await saveUserToFirestore(user.uid, name, email);
      Alert.alert("Success", "Account created successfully!");
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
    }
  };

  // Save User to Firestore
  const saveUserToFirestore = async (uid: string, name: string, email: string) => {
    try {
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        uid,
        createdAt: new Date(),
      });
    } catch (error: any) {
      Alert.alert("Database Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Signup</Text>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Button title="Signup" onPress={handleSignup} />

      {/* Redirect to Login Page */}
      <TouchableOpacity onPress={() => router.push("/login/login")} style={{ marginTop: 15 }}>
        <Text style={{ color: "blue" }}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for input fields
const styles = {
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
};

export default SignupScreen;
