import { forwardRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../theme/useAppTheme';
import TimePicker from './TimePicker';

const NotificationTimeSheet = forwardRef(({ initialTime, onSubmit }, ref) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const parseInitial = () => {
    if (!initialTime) return { hour: 8, minute: 0, period: 'AM' };
    const [h, m] = initialTime.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return { hour: hour12, minute: m, period };
  };

  const [time, setTime] = useState(parseInitial());

  const handleSave = useCallback(() => {
    let hour24 = time.hour % 12;
    if (time.period === 'PM') hour24 += 12;
    const timeString = `${String(hour24).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
    onSubmit(timeString);
    ref.current?.close();
  }, [time, onSubmit]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['45%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.heading}>Set Reminder Time</Text>

        <TimePicker
          hour={time.hour}
          minute={time.minute}
          period={time.period}
          onChange={setTime}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default NotificationTimeSheet;

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    heading: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 20,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      width: '100%',
      marginTop: 24,
    },
    saveButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
  });