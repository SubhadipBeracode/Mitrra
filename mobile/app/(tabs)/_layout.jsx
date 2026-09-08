import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, ListMusic, Settings as SettingsIcon, Download } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import MiniPlayerBar from '../../components/MiniPlayerBar';

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="sources"
          options={{
            title: 'Sources',
            tabBarIcon: ({ color, size }) => <ListMusic color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="downloads"
          options={{
            title: 'Downloads',
            tabBarIcon: ({ color, size }) => <Download color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
          }}
        />

      </Tabs>
      <MiniPlayerBar />
    </View>
  );
}

