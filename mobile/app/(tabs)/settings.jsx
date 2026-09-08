import { useState, useRef, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut, ChevronRight, Bell, Download, HelpCircle, Info, Lock, UserX, HardDrive } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserStore } from '../../store/useUserStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useDownloadStore } from '../../store/useDownloadStore';
import CustomAlert from '../../components/CustomAlert';
import NotificationTimeSheet from '../../components/NotificationTimeSheet';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';
import { ScrollView } from 'react-native-gesture-handler';

function formatTimeDisplay(timeString) {
  if (!timeString) return 'Not set';
  const [h, m] = timeString.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function Settings() {
  const router = useRouter();
  const { colors, mode } = useAppTheme();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccountAndLogout = useAuthStore((s) => s.deleteAccountAndLogout);
  const { name, email, avatarUri } = useUserStore();
  const styles = createStyles(colors);

  const notificationTime = useNotificationStore((s) => s.notificationTime);
  const setNotificationTime = useNotificationStore((s) => s.setNotificationTime);
  const initializePush = useNotificationStore((s) => s.initializePush);

  const getTotalSizeBytes = useDownloadStore((s) => s.getTotalSizeBytes);
  const clearAllDownloads = useDownloadStore((s) => s.clearAllDownloads);
  const downloads = useDownloadStore((s) => s.downloads);

  const sheetRef = useRef(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showClearDownloadsAlert, setShowClearDownloadsAlert] = useState(false);
  const [storageSize, setStorageSize] = useState(0);

  const isDark = mode === 'dark';

  useEffect(() => {
    getTotalSizeBytes().then(setStorageSize);
  }, [downloads]);

  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);
    await logout();
  };

  const handleConfirmDeleteAccount = async () => {
    setShowDeleteAlert(false);
    const result = await deleteAccountAndLogout();
    if (!result.success) {
      console.error('Failed to delete account:', result.error);
    }
  };

  const handleConfirmClearDownloads = async () => {
    setShowClearDownloadsAlert(false);
    await clearAllDownloads();
  };

  const handleOpenTimeSheet = async () => {
    await initializePush();
    sheetRef.current?.expand();
  };

  return (
    <ScreenGradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent} // Add this line
      >
        <Text style={styles.header}>Settings</Text>

        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => router.push('/edit-profile')}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name?.charAt(0)?.toUpperCase() || '?'}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
          <ChevronRight color={colors.textMuted} size={18} />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleOpenTimeSheet}>
            <View style={styles.rowLeft}>
              <Bell color={colors.primary} size={20} />
              <Text style={styles.rowText}>Daily Reminder</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{formatTimeDisplay(notificationTime)}</Text>
              <ChevronRight color={colors.textMuted} size={18} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              {isDark ? (
                <Moon color={colors.primary} size={20} />
              ) : (
                <Sun color={colors.primary} size={20} />
              )}
              <Text style={styles.rowText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Storage</Text>
        <View style={styles.card}>
          {/* <TouchableOpacity style={styles.row} onPress={() => router.push('/downloads')}>
            <View style={styles.rowLeft}>
              <Download color={colors.primary} size={20} />
              <Text style={styles.rowText}>Downloads</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity> */}

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <HardDrive color={colors.primary} size={20} />
              <Text style={styles.rowText}>Storage Used</Text>
            </View>
            <Text style={styles.rowValue}>{formatBytes(storageSize)}</Text>
          </View>

          {storageSize > 0 && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={() => setShowClearDownloadsAlert(true)}>
                <Text style={[styles.rowText, { color: colors.danger }]}>Clear All Downloads</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/help-support')}>
            <View style={styles.rowLeft}>
              <HelpCircle color={colors.primary} size={20} />
              <Text style={styles.rowText}>Help & Support</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={() => router.push('/about')}>
            <View style={styles.rowLeft}>
              <Info color={colors.primary} size={20} />
              <Text style={styles.rowText}>About</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/change-password')}>
            <View style={styles.rowLeft}>
              <Lock color={colors.primary} size={20} />
              <Text style={styles.rowText}>Change Password</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={() => setShowLogoutAlert(true)}>
            <View style={styles.rowLeft}>
              <LogOut color={colors.danger} size={20} />
              <Text style={[styles.rowText, { color: colors.danger }]}>Log Out</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={() => setShowDeleteAlert(true)}>
            <View style={styles.rowLeft}>
              <UserX color={colors.danger} size={20} />
              <Text style={[styles.rowText, { color: colors.danger }]}>Delete Account</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Moved outside of ScrollView */}
      <NotificationTimeSheet
        ref={sheetRef}
        initialTime={notificationTime}
        onSubmit={setNotificationTime}
      />

      <CustomAlert
        visible={showLogoutAlert}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        destructive
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutAlert(false)}
      />

      <CustomAlert
        visible={showDeleteAlert}
        title="Delete Account?"
        message="This will permanently delete your account, topics, episodes, and all data. This cannot be undone."
        confirmText="Delete Forever"
        destructive
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setShowDeleteAlert(false)}
      />

      <CustomAlert
        visible={showClearDownloadsAlert}
        title="Clear All Downloads?"
        message="This will remove all downloaded episodes from your device."
        confirmText="Clear All"
        destructive
        onConfirm={handleConfirmClearDownloads}
        onCancel={() => setShowClearDownloadsAlert(false)}
      />
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingBottom: 120, // Adds extra space at the very bottom so you can scroll past the last item
    },
    header: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 20,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 24,
      gap: 14,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    avatarText: {
      color: colors.background,
      fontSize: 22,
      fontWeight: '700',
    },
    profileInfo: {
      flex: 1,
      gap: 2,
    },
    profileName: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '600',
    },
    profileEmail: {
      color: colors.textMuted,
      fontSize: 13,
    },
    sectionLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 8,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      marginBottom: 24,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rowValue: {
      color: colors.textMuted,
      fontSize: 14,
    },
    rowText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 48,
    },
  });