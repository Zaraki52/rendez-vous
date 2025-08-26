"use client"

import { useState } from "react"
import { View, TextInput, Button, Text, StyleSheet } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase-config"

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigation.navigate("Home")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={styles.input} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
  error: { color: "red" },
})
