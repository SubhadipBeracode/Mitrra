import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

export default function EmptyState({ imageSource, title, subtitle, buttonText, onButtonPress }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {imageSource && (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      marginTop: 60,
    },
    image: {
      width: 130,
      height: 130,
      borderRadius: 20,
      marginBottom: 5,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 6,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 4,
    },
    buttonText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '700',
    },
  });