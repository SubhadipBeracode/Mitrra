import { forwardRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../theme/useAppTheme';
import PlatformPicker from './PlatformPicker';

const AddTopicItemSheet = forwardRef(({ onSubmit }, ref) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [itemType, setItemType] = useState('RSS');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('Website');

  const handleSubmit = useCallback(() => {
    if (!url.trim()) return;

    onSubmit({
      type: itemType,
      url: url.trim(),
      platform: itemType === 'Link' ? platform : 'Website',
    });

    setUrl('');
    setPlatform('Website');
    setItemType('RSS');
    ref.current?.close();
  }, [itemType, url, platform, onSubmit]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['55%']}
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
            style={[styles.typeButton, itemType === 'RSS' && styles.typeButtonActive]}
            onPress={() => setItemType('RSS')}
          >
            <Text style={[styles.typeButtonText, itemType === 'RSS' && styles.typeButtonTextActive]}>
              RSS Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, itemType === 'Link' && styles.typeButtonActive]}
            onPress={() => setItemType('Link')}
          >
            <Text style={[styles.typeButtonText, itemType === 'Link' && styles.typeButtonTextActive]}>
              From Link
            </Text>
          </TouchableOpacity>
        </View>

        {itemType === 'Link' && (
          <>
            <Text style={styles.label}>Platform</Text>
            <PlatformPicker selected={platform} onSelect={setPlatform} />
          </>
        )}

        <Text style={styles.label}>{itemType === 'RSS' ? 'RSS Feed URL' : 'Link URL'}</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder={itemType === 'RSS' ? 'https://example.com/feed/' : 'https://instagram.com/p/...'}
          placeholderTextColor={colors.textMuted}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <TouchableOpacity
          style={[styles.submitButton, !url.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!url.trim()}
        >
          <Text style={styles.submitButtonText}>Add</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default AddTopicItemSheet;

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      gap: 12,
    },
    heading: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
    },
    typeRow: {
      flexDirection: 'row',
      gap: 10,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 12,
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
    },
    typeButtonTextActive: {
      color: colors.background,
    },
    label: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 6,
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