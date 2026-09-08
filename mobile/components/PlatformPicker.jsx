import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';

const platforms = ['Website', 'Instagram', 'YouTube', 'LinkedIn', 'X', 'Facebook'];

export default function PlatformPicker({ selected, onSelect }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (platform) => {
    onSelect(platform);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={() => setIsOpen(true)}>
        <Text style={styles.triggerText}>{selected}</Text>
        <ChevronDown color={colors.textMuted} size={18} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={platforms}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, item === selected && styles.optionTextActive]}>
                    {item}
                  </Text>
                  {item === selected && <Check color={colors.primary} size={18} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    triggerText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    dropdown: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      width: '100%',
      maxWidth: 320,
      paddingVertical: 8,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 18,
    },
    optionText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '500',
    },
    optionTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
  });