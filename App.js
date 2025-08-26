"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { onAuthStateChanged } from "firebase/auth"
import AppNavigator from "./src/navigation/AppNavigator"
import AuthNavigator from "./src/navigation/AuthNavigator"
import { auth } from "./src/firebase-config"
import { ActivityIndicator, View, Text } from "react-native"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log("[v0] App component loaded")

  useEffect(() => {
    console.log("[v0] Setting up auth listener")
    try {
      const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
        console.log("[v0] Auth state changed:", authenticatedUser ? "User logged in" : "No user")
        setUser(authenticatedUser)
        setLoading(false)
      })

      return () => {
        console.log("[v0] Cleaning up auth listener")
        unsubscribe()
      }
    } catch (err) {
      console.error("[v0] Error setting up auth:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  console.log("[v0] Render state - loading:", loading, "user:", !!user, "error:", error)

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>Erreur de configuration:</Text>
        <Text style={{ textAlign: "center" }}>{error}</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    )
  }

  return <NavigationContainer>{user ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>
}
