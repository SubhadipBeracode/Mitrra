import { forwardRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../theme/useAppTheme';
import { useEpisodeStore } from '../store/useEpisodeStore';

const AddSourceSheet = forwardRef(({ onSubmit, onLinkGenerated, onLinkError }, ref) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState('');
  const [type, setType] = useState('RSS');
  const [url, setUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [generatingFromLink, setGeneratingFromLink] = useState(false);

  const generateFromUrl = useEpisodeStore((s) => s.generateFromUrl);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) return;
    if (type === 'RSS' && !url.trim()) return;

    onSubmit({
      name: name.trim(),
      type,
      url: type === 'RSS' ? url.trim() : null,
    });

    setName('');
    setType('RSS');
    setUrl('');
    ref.current?.close();
  }, [name, type, url, onSubmit]);

  const handleGenerateFromLink = useCallback(async () => {
    if (!linkUrl.trim()) return;

    setGeneratingFromLink(true);
    const result = await generateFromUrl(linkUrl.trim());
    setGeneratingFromLink(false);

    if (result.success) {
      setLinkUrl('');
      ref.current?.close();
      onLinkGenerated?.();
    } else {
      onLinkError?.(result.error);
    }
  }, [linkUrl, generateFromUrl, onLinkGenerated, onLinkError]);

  const isValid = name.trim() && (type !== 'RSS' || url.trim());

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['65%']}
      enablePanDownToClose
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.heading}>Add Source</Text>

        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'RSS' && styles.typeButtonActive]}
            onPress={() => setType('RSS')}
          >
            <Text style={[styles.typeButtonText, type === 'RSS' && styles.typeButtonTextActive]}>
              RSS Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'Topic' && styles.typeButtonActive]}
            onPress={() => setType('Topic')}
          >
            <Text style={[styles.typeButtonText, type === 'Topic' && styles.typeButtonTextActive]}>
              Topic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'Link' && styles.typeButtonActive]}
            onPress={() => setType('Link')}
          >
            <Text style={[styles.typeButtonText, type === 'Link' && styles.typeButtonTextActive]}>
              From Link
            </Text>
          </TouchableOpacity>
        </View>

        {type === 'Link' ? (
          <>
            <Text style={styles.linkDescription}>
              Paste a link to any article, blog post, or public page. We'll turn it into a podcast episode right away.
            </Text>

            <BottomSheetTextInput
              style={styles.input}
              placeholder="https://example.com/article"
              placeholderTextColor={colors.textMuted}
              value={linkUrl}
              onChangeText={setLinkUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <TouchableOpacity
              style={[styles.submitButton, !linkUrl.trim() && styles.submitButtonDisabled]}
              onPress={handleGenerateFromLink}
              disabled={!linkUrl.trim() || generatingFromLink}
            >
              {generatingFromLink ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>Generate Episode</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Source name (e.g. TechCrunch)"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            {type === 'RSS' && (
              <BottomSheetTextInput
                style={styles.input}
                placeholder="RSS feed URL (e.g. https://techcrunch.com/feed/)"
                placeholderTextColor={colors.textMuted}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
            )}

            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.submitButtonText}>Add Source</Text>
            </TouchableOpacity>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default AddSourceSheet;

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      gap: 16,
    },
    heading: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 14,
      color: colors.text,
      fontSize: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeRow: {
      flexDirection: 'row',
      gap: 8,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      color: colors.textMuted,
      fontWeight: '600',
      fontSize: 13,
    },
    typeButtonTextActive: {
      color: colors.background,
    },
    linkDescription: {
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 10,
    },
    submitButtonDisabled: {
      opacity: 0.4,
    },
    submitButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
  });