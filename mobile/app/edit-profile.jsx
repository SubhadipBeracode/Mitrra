import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { useUserStore } from '../store/useUserStore';
import ScreenGradientBackground from '../components/ScreenGradientBackground';

export default function EditProfile() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { name: savedName, email: savedEmail, avatarUri: savedAvatar, updateProfile } = useUserStore();

  const [name, setName] = useState(savedName);
  const [avatarUri, setAvatarUri] = useState(savedAvatar);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }

    setSaving(true);
    const result = await updateProfile({ name: name.trim(), avatarUri });
    setSaving(false);

    if (result.success) {
      router.back();
    } else {
      Alert.alert('Update Failed', result.error || 'Something went wrong.');
    }
  };

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft color={colors.text} size={28} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Edit Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Camera color={colors.background} size={16} />
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={savedEmail}
          editable={false}
          placeholderTextColor={colors.textMuted}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
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
      marginBottom: 30,
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    avatarWrapper: {
      alignSelf: 'center',
      marginBottom: 30,
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarPlaceholderText: {
      color: colors.background,
      fontSize: 36,
      fontWeight: '700',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    label: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 6,
      marginLeft: 4,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 14,
      color: colors.text,
      fontSize: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputDisabled: {
      opacity: 0.5,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    saveButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
  });