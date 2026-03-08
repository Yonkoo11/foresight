import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMobileWallet } from '../utils/useMobileWallet';
import { useAuth } from '../providers/AuthProvider';
import api from '../services/api';
import { colors } from '../constants/colors';
import { haptics } from '../utils/haptics';

type LoginMethod = 'idle' | 'wallet';

export default function AuthScreen() {
  const { signIn } = useMobileWallet();
  const { login } = useAuth();
  const navigation = useNavigation();
  const [activeMethod, setActiveMethod] = useState<LoginMethod>('idle');
  const [error, setError] = useState<string | null>(null);

  const isLoading = activeMethod !== 'idle';

  // ── Wallet Connect (MWA / SIWS) ──────────────────────────────
  const handleWalletConnect = useCallback(async () => {
    try {
      setActiveMethod('wallet');
      setError(null);
      haptics.impact();

      const account = await signIn({
        domain: 'ct-foresight.xyz',
        statement: 'Sign in to CT Foresight -- Draft. Compete. Win.',
        uri: 'https://ct-foresight.xyz',
      });

      const signInResult = account.signInResult;
      if (!signInResult) {
        throw new Error('Wallet did not return sign-in proof. Please try again.');
      }

      const response = await api.post('/api/auth/wallet-verify', {
        address: account.publicKey.toBase58(),
        signedMessage: Buffer.from(signInResult.signed_message).toString('base64'),
        signature: Buffer.from(signInResult.signature).toString('base64'),
      });

      if (response.data.success) {
        haptics.success();
        await login(
          response.data.data.accessToken,
          response.data.data.refreshToken,
          response.data.data.user,
        );
        navigation.goBack();
      }
    } catch (err: any) {
      haptics.error();
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setActiveMethod('idle');
    }
  }, [signIn, login, navigation]);

  // ── Skip / Browse as Guest ────────────────────────────────────
  const handleSkip = useCallback(() => {
    haptics.selection();
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Drag handle for modal */}
        <View style={styles.dragHandle} />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CT</Text>
          <Text style={styles.logoSubtext}>FORESIGHT</Text>
        </View>

        <Text style={styles.tagline}>Draft. Compete. Win.</Text>

        {/* ── Login Options ─────────────────────── */}
        <View style={styles.options}>
          {/* Wallet Connect */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleWalletConnect}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {activeMethod === 'wallet' ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="wallet" size={20} color={colors.background} />
                <Text style={styles.optionButtonText}>Connect Wallet</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Powered-by badge */}
          <View style={styles.mwaBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color={colors.textMuted} />
            <Text style={styles.mwaBadgeText}>Powered by Mobile Wallet Adapter</Text>
          </View>
        </View>

        {/* Error message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Skip */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Browse as guest</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.solBadge}>
            <MaterialCommunityIcons name="circle" size={8} color={colors.success} />
            <Text style={styles.footerText}>Solana Mobile</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginTop: 12,
    marginBottom: 32,
    opacity: 0.4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: 6,
  },
  logoSubtext: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 8,
    marginTop: -4,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 40,
  },

  // Options
  options: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.brand,
    paddingVertical: 18,
    borderRadius: 14,
    width: '100%',
  },
  optionButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  mwaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  mwaBadgeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // Error
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },

  // Skip
  skipButton: {
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },

  // Footer
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  solBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
