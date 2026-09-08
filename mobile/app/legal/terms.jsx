import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';

export default function Terms() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft color={colors.text} size={28} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Terms of Service</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bodyText}>
            By using AI Daily Digest, you agree to use the app for personal, non-commercial purposes only.
            {'\n\n'}
            Content generated through this app is created using third-party AI services and is provided
            "as is" without warranty of accuracy. You are responsible for verifying any information before
            acting on it.
            {'\n\n'}
            We reserve the right to update these terms at any time. Continued use of the app after changes
            constitutes acceptance of the updated terms.
            {'\n\n'}
            (Replace this placeholder text with your actual Terms of Service before publishing the app.)
          </Text>
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
      paddingHorizontal: 20,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    bodyText: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 22,
    },
  });