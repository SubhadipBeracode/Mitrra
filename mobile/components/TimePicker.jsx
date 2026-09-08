import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../theme/useAppTheme';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
const periods = ['AM', 'PM'];

function ScrollColumn({ data, selectedValue, onSelect, formatItem }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const listRef = useRef(null);

  const selectedIndex = data.indexOf(selectedValue);

  useEffect(() => {
    if (selectedIndex >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToOffset({ offset: selectedIndex * ITEM_HEIGHT, animated: false });
      }, 50);
    }
  }, []);

  const handleMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    onSelect(data[clampedIndex]);
  };

  return (
    <BottomSheetFlatList
      ref={listRef}
      data={data}
      keyExtractor={(item) => String(item)}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            const index = data.indexOf(item);
            listRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
            onSelect(item);
          }}
        >
          <Text style={[styles.itemText, item === selectedValue && styles.itemTextActive]}>
            {formatItem ? formatItem(item) : item}
          </Text>
        </TouchableOpacity>
      )}
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
    />
  );
}

export default function TimePicker({ hour, minute, period, onChange }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.highlightBox} pointerEvents="none" />

      <ScrollColumn
        data={hours}
        selectedValue={hour}
        onSelect={(value) => onChange({ hour: value, minute, period })}
        formatItem={(item) => String(item).padStart(2, '0')}
      />

      <Text style={styles.colon}>:</Text>

      <ScrollColumn
        data={minutes}
        selectedValue={minute}
        onSelect={(value) => onChange({ hour, minute: value, period })}
        formatItem={(item) => String(item).padStart(2, '0')}
      />

      <ScrollColumn
        data={periods}
        selectedValue={period}
        onSelect={(value) => onChange({ hour, minute, period: value })}
      />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    highlightBox: {
      position: 'absolute',
      top: ITEM_HEIGHT,
      left: 0,
      right: 0,
      height: ITEM_HEIGHT,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    item: {
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
    },
    itemText: {
      fontSize: 18,
      color: colors.textMuted,
    },
    itemTextActive: {
      color: colors.text,
      fontWeight: '700',
      fontSize: 20,
    },
    colon: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginHorizontal: 4,
    },
  });