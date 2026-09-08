import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { ChevronLeft, ChevronRight, Star, FileText, Shield } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';
import ScreenGradientBackground from '../components/ScreenGradientBackground';

export default function About() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleRateApp = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.yourname.aidailydigest');
  };

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft color={colors.text} size={28} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>About</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.appInfoCard}>
            <Text style={styles.appName}>AI Daily Digest</Text>
            <Text style={styles.appVersion}>Version {appVersion}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={handleRateApp}>
              <View style={styles.rowLeft}>
                <Star color={colors.primary} size={20} />
                <Text style={styles.rowText}>Rate the App</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={18} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/legal/terms')}>
              <View style={styles.rowLeft}>
                <FileText color={colors.primary} size={20} />
                <Text style={styles.rowText}>Terms of Service</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={18} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/legal/privacy')}>
              <View style={styles.rowLeft}>
                <Shield color={colors.primary} size={20} />
                <Text style={styles.rowText}>Privacy Policy</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={18} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    appInfoCard: {
      alignItems: 'center',
      marginBottom: 30,
    },
    appName: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
    },
    appVersion: {
      color: colors.textMuted,
      fontSize: 13,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rowText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 48,
    },
  });