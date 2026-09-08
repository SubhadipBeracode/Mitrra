import { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Sparkles, Rss } from 'lucide-react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { useTopicStore } from '../../store/useTopicStore';
import { useEpisodeStore } from '../../store/useEpisodeStore';
import TopicItemRow from '../../components/TopicItemRow';
import AddTopicItemSheet from '../../components/AddTopicItemSheet';
import EmptyState from '../../components/EmptyState';
import CustomAlert from '../../components/CustomAlert';
import ScreenGradientBackground from '../../components/ScreenGradientBackground';

export default function TopicDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const sheetRef = useRef(null);

  const topics = useTopicStore((s) => s.topics);
  const topicItems = useTopicStore((s) => s.topicItems);
  const itemsLoading = useTopicStore((s) => s.itemsLoading);
  const fetchTopicItems = useTopicStore((s) => s.fetchTopicItems);
  const addItemToTopic = useTopicStore((s) => s.addItemToTopic);
  const removeItemFromTopic = useTopicStore((s) => s.removeItemFromTopic);

  const generateFromTopic = useEpisodeStore((s) => s.generateFromTopic);
  const generateFromItem = useEpisodeStore((s) => s.generateFromItem);

  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingItemId, setGeneratingItemId] = useState(null);
  const [resultAlert, setResultAlert] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const topic = topics.find((t) => t._id === id);
  const items = topicItems[id] || [];

  useEffect(() => {
    fetchTopicItems(id);
  }, [id]);

  const handleAddItem = async (item) => {
    const result = await addItemToTopic(id, item);
    if (!result.success) {
      setResultAlert({ title: 'Failed to Add', message: result.error });
    }
  };

  const handleGenerateAll = async () => {
    if (items.length === 0) {
      setResultAlert({ title: 'No Sources', message: 'Add at least one RSS feed or link before generating.' });
      return;
    }

    setGeneratingAll(true);
    const result = await generateFromTopic(id);
    setGeneratingAll(false);

    if (result.success) {
      setResultAlert({ title: 'Episode Ready!', message: `Your ${topic?.name} briefing is ready to play.` });
    } else {
      setResultAlert({ title: 'Generation Failed', message: result.error || 'Something went wrong.' });
    }
  };

  const handleGenerateItem = async (item) => {
    setGeneratingItemId(item._id);
    const result = await generateFromItem(id, item._id);
    setGeneratingItemId(null);

    if (result.success) {
      setResultAlert({ title: 'Episode Ready!', message: 'Your episode from this source is ready to play.' });
    } else {
      setResultAlert({ title: 'Generation Failed', message: result.error || 'Something went wrong.' });
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (itemToDelete) {
      await removeItemFromTopic(id, itemToDelete._id);
      setItemToDelete(null);
    }
  };

  return (
    <ScreenGradientBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft color={colors.text} size={28} />
          </TouchableOpacity>

          <Text style={styles.topBarTitle} numberOfLines={1}>{topic?.name || 'Topic'}</Text>

          <View style={styles.topBarActions}>
            {/* <TouchableOpacity
              onPress={handleGenerateAll}
              disabled={generatingAll}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {generatingAll ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Sparkles color={colors.primary} size={22} />
              )}
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => sheetRef.current?.expand()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Plus color={colors.primary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {itemsLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TopicItemRow
                item={item}
                onDelete={() => setItemToDelete(item)}
                onGenerate={() => handleGenerateItem(item)}
                isGenerating={generatingItemId === item._id}
              />
            )}
            contentContainerStyle={items.length === 0 ? { flex: 1 } : { paddingBottom: 20, paddingTop: 10 }}
            ListEmptyComponent={
              <EmptyState
                imageSource={require('../../assets/image/rss.png')}
                title="No sources in this topic"
                subtitle="Tap + to add an RSS feed or a link from Instagram, YouTube, LinkedIn, and more"
              />
            }
          />
        )}

        <AddTopicItemSheet ref={sheetRef} onSubmit={handleAddItem} />

        <CustomAlert
          visible={!!itemToDelete}
          title="Remove Source?"
          message="Are you sure you want to remove this source from the topic?"
          confirmText="Remove"
          destructive
          onConfirm={handleConfirmDeleteItem}
          onCancel={() => setItemToDelete(null)}
        />

        <CustomAlert
          visible={!!resultAlert}
          title={resultAlert?.title}
          message={resultAlert?.message}
          confirmText="OK"
          cancelText=""
          onConfirm={() => setResultAlert(null)}
          onCancel={() => setResultAlert(null)}
        />
      </View>
    </ScreenGradientBackground>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    topBarTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 10,
    },
    topBarActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
  });