import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';

export default function Privacy() {
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
          <Text style={styles.topBarTitle}>Privacy Policy</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bodyText}>
            We collect your email, name, and sources you add to generate personalized podcast episodes.
            {'\n\n'}
            Content you provide (RSS feeds, links) is sent to third-party AI services for summarization and
            audio generation. We do not sell your personal data to advertisers.
            {'\n\n'}
            Downloaded episodes are stored locally on your device. You can delete your account and all
            associated data at any time from Settings.
            {'\n\n'}
            (Replace this placeholder text with your actual Privacy Policy before publishing the app.)
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