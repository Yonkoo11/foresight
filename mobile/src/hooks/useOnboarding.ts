import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'ct_onboarding_seen';

export type OnboardingTip = 'welcome' | 'draft_hint' | 'compete_hint';

export function useOnboarding(tip: OnboardingTip) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((raw) => {
      const seen: string[] = raw ? JSON.parse(raw) : [];
      if (!seen.includes(tip)) setVisible(true);
    });
  }, [tip]);

  const dismiss = useCallback(async () => {
    setVisible(false);
    const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    if (!seen.includes(tip)) {
      seen.push(tip);
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(seen));
    }
  }, [tip]);

  return { visible, dismiss };
}
