import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useSourceStore } from '../store/userSourceStore';
import { availableTopics } from '../data/mockData';
import TopicChip from '../components/TopicChip';
import FadeInView from '../components/FadeInView';
import ScreenGradientBackground from '../components/ScreenGradientBackground';

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const addNewSource = useSourceStore((s) => s.addNewSource);

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    const trimmed = customTopic.trim();
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics((prev) => [...prev, trimmed]);
    }
    setCustomTopic('');
    setShowCustomInput(false);
  };

  const finishOnboarding = async () => {
    for (const topic of selectedTopics) {
      await addNewSource({ name: topic, type: 'Topic' });
    }
    completeOnboarding();
    router.replace('/(tabs)');
  };

  // const handleSkip = () => {
  //   completeOnboarding();
  //   router.replace('/(tabs)');
  // };

  return (
    <ScreenGradientBackground>
      <FadeInView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>What are you into?</Text>
          <Text style={styles.subtitle}>
            Pick a few topics so we can personalize your daily digest
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.chipsWrap} showsVerticalScrollIndicator={false}>
          <View style={styles.chipsRow}>
            {availableTopics.map((topic) => (
              <TopicChip
                key={topic}
                label={topic}
                selected={selectedTopics.includes(topic)}
                onPress={() => toggleTopic(topic)}
              />
            ))}
            {selectedTopics
              .filter((t) => !availableTopics.includes(t))
              .map((topic) => (
                <TopicChip
                  key={topic}
                  label={topic}
                  selected
                  onPress={() => toggleTopic(topic)}
                />
              ))}
          </View>

          {showCustomInput ? (
            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customInput}
                placeholder="Type a topic..."
                placeholderTextColor={colors.textMuted}
                value={customTopic}
                onChangeText={setCustomTopic}
                onSubmitEditing={addCustomTopic}
                autoFocus
              />
              <TouchableOpacity style={styles.customAddButton} onPress={addCustomTopic}>
                <Text style={styles.customAddButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addCustomButton} onPress={() => setShowCustomInput(true)}>
              <Plus color={colors.primary} size={18} />
              <Text style={styles.addCustomText}>Add your own</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, selectedTopics.length === 0 && styles.continueButtonDisabled]}
            onPress={finishOnboarding}
            disabled={selectedTopics.length === 0}
          >
            <Text style={styles.continueButtonText}>
              Continue {selectedTopics.length > 0 ? `(${selectedTopics.length})` : ''}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity> */}
        </View>
      </FadeInView>
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      color: colors.text,
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 8,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    chipsWrap: {
      paddingBottom: 20,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    addCustomButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    addCustomText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    customInputRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4,
    },
    customInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      color: colors.text,
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    customAddButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 18,
      justifyContent: 'center',
    },
    customAddButtonText: {
      color: colors.background,
      fontWeight: '700',
    },
    footer: {
      paddingBottom: 30,
      paddingTop: 10,
      alignItems: 'center',
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 15,
      alignItems: 'center',
      width: '100%',
      marginBottom: 14,
    },
    continueButtonDisabled: {
      opacity: 0.4,
    },
    continueButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
    skipText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
  });