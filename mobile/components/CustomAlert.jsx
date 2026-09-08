import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

export default function CustomAlert({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const showCancelButton = cancelText && cancelText.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttonRow}>
            {showCancelButton && (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                destructive && styles.confirmButtonDestructive,
                !showCancelButton && styles.confirmButtonFullWidth,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.confirmText, destructive && styles.confirmTextDestructive]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 22,
      width: '100%',
      maxWidth: 340,
    },
    title: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    cancelText: {
      color: colors.text,
      fontWeight: '600',
      fontSize: 15,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    confirmButtonFullWidth: {
      flex: 1,
      width: '100%',
    },
    confirmButtonDestructive: {
      backgroundColor: colors.danger,
    },
    confirmText: {
      color: colors.background,
      fontWeight: '700',
      fontSize: 15,
    },
    confirmTextDestructive: {
      color: colors.background,
    },
  });