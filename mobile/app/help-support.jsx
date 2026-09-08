import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { useAppTheme } from '../theme/useAppTheme';
import ScreenGradientBackground from '../components/ScreenGradientBackground';

const faqs = [
  {
    question: 'How does the daily digest work?',
    answer: 'Every night, we fetch the latest articles from your sources, rank them by relevance, and generate a short conversational podcast using AI. It\'s ready when you wake up.',
  },
  {
    question: 'Can I change what time I get notified?',
    answer: 'Yes. Go to Settings > Notifications and set your preferred reminder time.',
  },
  {
    question: 'Do downloaded episodes work without internet?',
    answer: 'Yes, once downloaded, episodes are saved on your device and play fully offline.',
  },
  {
    question: 'How do I add a new source?',
    answer: 'Go to the Sources tab, tap the + button, and add an RSS feed URL or a topic.',
  },
];

export default function HelpSupport() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContactEmail = () => {
    Linking.openURL('mailto:wbjeemain@gmail.com?subject=App Support Request');
  };

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/settings')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft color={colors.text} size={28} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Help & Support</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>

          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => toggleFaq(index)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedIndex === index ? (
                  <ChevronUp color={colors.textMuted} size={18} />
                ) : (
                  <ChevronDown color={colors.textMuted} size={18} />
                )}
              </View>
              {expandedIndex === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionLabel}>Still need help?</Text>
          <TouchableOpacity style={styles.contactCard} onPress={handleContactEmail}>
            <Mail color={colors.primary} size={20} />
            <View style={styles.contactTextGroup}>
              <Text style={styles.contactTitle}>Contact Support</Text>
              <Text style={styles.contactSubtitle}>wbjeemain@gmail.com</Text>
            </View>
          </TouchableOpacity>
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
      marginBottom: 20,
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    sectionLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 10,
      marginTop: 10,
    },
    faqCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
    },
    faqHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    faqQuestion: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      flex: 1,
      marginRight: 10,
    },
    faqAnswer: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 10,
      lineHeight: 19,
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      gap: 14,
      marginBottom: 30,
    },
    contactTextGroup: {
      gap: 2,
    },
    contactTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    contactSubtitle: {
      color: colors.textMuted,
      fontSize: 13,
    },
  });