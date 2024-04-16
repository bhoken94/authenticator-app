import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "purple",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Token",
          tabBarIcon: ({ color }) => (
            <Octicons size={28} name="key" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Impostazioni",
          tabBarIcon: ({ color }) => (
            <Octicons size={28} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
