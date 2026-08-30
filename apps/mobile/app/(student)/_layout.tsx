import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

// Cast to bypass React 18/19 mismatch between expo-router and root @types/react
const TabsNavigator = Tabs as unknown as React.ComponentType<Record<string, unknown>> & {
  Screen: React.ComponentType<Record<string, unknown>>;
};

export default function StudentLayout() {
  return (
    <TabsNavigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0d1326",
          borderTopColor: "#1e293b",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <TabsNavigator.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>📚</Text>,
        }}
      />
      <TabsNavigator.Screen
        name="coach"
        options={{
          title: "Coach",
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🗣️</Text>,
        }}
      />
      <TabsNavigator.Screen
        name="tutor"
        options={{
          title: "Tutor",
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🤖</Text>,
        }}
      />
      <TabsNavigator.Screen
        name="placement"
        options={{
          title: "Placement",
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🎯</Text>,
        }}
      />
    </TabsNavigator>
  );
}
