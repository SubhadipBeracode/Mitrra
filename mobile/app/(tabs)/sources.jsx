import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Folder, Trash2 } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTopicStore } from '../../store/useTopicStore';
import EmptyState from '../../components/EmptyState';
import CustomAlert from '../../components/CustomAlert';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';
import { useAuthStore } from '../../store/useAuthStore';
export default function Sources() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const topics = useTopicStore((s) => s.topics);
  const loading = useTopicStore((s) => s.loading);
  const fetchTopics = useTopicStore((s) => s.fetchTopics);
  const addTopic = useTopicStore((s) => s.addTopic);
  const removeTopic = useTopicStore((s) => s.removeTopic);

  const [showAddInput, setShowAddInput] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [topicToDelete, setTopicToDelete] = useState(null);

const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

useEffect(() => {
  if (isAuthenticated) {
    fetchTopics();
  }
}, [isAuthenticated]);

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) return;
    await addTopic(newTopicName.trim());
    setNewTopicName('');
    setShowAddInput(false);
  };

  const handleConfirmDelete = async () => {
    if (topicToDelete) {
      await removeTopic(topicToDelete._id);
      setTopicToDelete(null);
    }
  };

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Your Topics</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddInput((prev) => !prev)}
          >
            <Plus color={colors.background} size={22} />
          </TouchableOpacity>
        </View>

        {showAddInput && (
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Topic name (e.g. Tech News)"
              placeholderTextColor={colors.textMuted}
              value={newTopicName}
              onChangeText={setNewTopicName}
              onSubmitEditing={handleAddTopic}
              autoFocus
            />
            <TouchableOpacity style={styles.addConfirmButton} onPress={handleAddTopic}>
              <Text style={styles.addConfirmText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={topics}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.topicCard}
              onPress={() => router.push(`/topic/${item._id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.topicLeft}>
                <View style={styles.topicIcon}>
                  <Folder color={colors.primary} size={20} />
                </View>
                <Text style={styles.topicName}>{item.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setTopicToDelete(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 color={colors.danger} size={20} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          contentContainerStyle={topics.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTopics}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              imageSource={require('../../assets/image/folder.png')}
              title="No topics yet"
              subtitle="Tap + to create a topic, then add RSS feeds or links to it"
             
            />
          }
        />

        <CustomAlert
          visible={!!topicToDelete}
          title="Delete Topic?"
          message={`Are you sure you want to delete "${topicToDelete?.name}"? This will remove all its sources too.`}
          confirmText="Delete"
          destructive
          onConfirm={handleConfirmDelete}
          onCancel={() => setTopicToDelete(null)}
        />
      </View>
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    header: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '700',
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      top: 5
    },
    addRow: {
      flexDirection: 'row',
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    addInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addConfirmButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 18,
      justifyContent: 'center',
    },
    addConfirmText: {
      color: colors.background,
      fontWeight: '700',
    },
    topicCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
    },
    topicLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    topicIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topicName: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });