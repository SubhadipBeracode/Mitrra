import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useAuthStore } from '../../store/useAuthStore';
import FadeInView from '../../components/FadeInView';
// import PodcastIllustration from '../../components/PodcastIllustration';
// import { Image } from 'react-native';

export default function Login() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    const success = await login(email.trim(), password);
    if (success) {
      router.replace('/(tabs)');
    } else {
      setErrorMsg(useAuthStore.getState().error || 'Login failed');
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary + '80', colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
      style={styles.gradientBackground}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeInView style={styles.container}>
            <View style={styles.heroSection}>
              <Image
                source={require('../../assets/image/login.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to continue your daily digest</Text>

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <View style={styles.inputWrapper}>
                <Mail color={colors.textMuted} size={18} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock color={colors.textMuted} size={18} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.primaryButtonText}>Log In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.footerLink}>
                <Text style={styles.footerText}>
                  Don't have an account? <Text style={styles.footerLinkText}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    gradientBackground: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
    },
    heroSection: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 50,
      paddingBottom: 4,
    },
    formSection: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      paddingBottom:0,
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 6,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 20,
    },
    errorText: {
      color: colors.danger,
      fontSize: 13,
      marginBottom: 14,
      textAlign: 'center',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
      paddingVertical: 14,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 8,
    },
    primaryButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
    footerLink: {
      marginTop: 24,
      alignItems: 'center',
    },
    footerText: {
      color: colors.textMuted,
      fontSize: 14,
    },
    footerLinkText: {
      color: colors.primary,
      fontWeight: '700',
    },
    heroImage: {
      width: 240,
      height: 240,
    },
  });