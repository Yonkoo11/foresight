import React from 'react';
import { NavigationContainer, DefaultTheme, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useAuth } from '../providers/AuthProvider';
import AuthScreen from '../screens/AuthScreen';
import ContestDetailScreen from '../screens/ContestDetailScreen';
import DraftScreen from '../screens/DraftScreen';
import SKRScreen from '../screens/SKRScreen';
import InfluencerListScreen from '../screens/InfluencerListScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { colors, elevation, borders } from '../constants/colors';

export type RootStackParamList = {
  Main: undefined;
  Auth: { returnTo?: keyof RootStackParamList; returnParams?: Record<string, any> } | undefined;
  ContestDetail: { contestId: string; justEntered?: boolean };
  Draft: { contestId: string };
  InfluencerList: undefined;
  SKR: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'https://ct-foresight.xyz'],
  config: {
    screens: {
      ContestDetail: 'contest/:contestId',
      Draft: 'draft/:contestId',
      InfluencerList: 'influencers',
      SKR: 'skr',
      Main: {
        screens: {
          Home: '',
          Compete: 'compete',
          Feed: 'feed',
          Profile: 'profile',
        },
      },
    },
  },
};

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brand,
    background: colors.background,
    card: elevation.surface,
    text: colors.text,
    border: borders.subtle,
    notification: colors.brand,
  },
};

export function RootNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="ContestDetail"
          component={ContestDetailScreen}
          options={{
            headerShown: true,
            title: 'Contest',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700', fontSize: 17 },
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Draft"
          component={DraftScreen}
          options={{
            headerShown: true,
            title: 'Draft Your Team',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700', fontSize: 17 },
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="InfluencerList"
          component={InfluencerListScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="SKR"
          component={SKRScreen}
          options={{
            headerShown: true,
            title: 'SKR Token',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700', fontSize: 17 },
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
