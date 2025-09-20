
import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Dimensions,
  Pressable
} from 'react-native';
import Video, { VideoRef } from 'react-native-video'
import { Image } from 'expo-image'
import { videos } from '@/data/videos';

interface ViedeoWrapperProps {
  data: ListRenderItemInfo<string>;
  allVideos: string[];
  visibleIndex: number;
  pause: () => void;
  pauseOverride: boolean;
}

const { width, height } = Dimensions.get('window')
const _imageSize = 50;

export const ViedeoWrapper = ({
  data,
  allVideos,
  visibleIndex,
  pause,
  pauseOverride
}: ViedeoWrapperProps) => {

  const { index, } = data;
  const videoRef = useRef<VideoRef>(null)

  useEffect(() => {
    videoRef.current?.seek(0)
  }, [visibleIndex])

  return (
    <View
      style={styles.videoWrapper}
    >
      <Video
        ref={videoRef}
        source={{ uri: allVideos[index] }}
        style={styles.videoStyle}
        resizeMode='cover'
        paused={visibleIndex !== index || pauseOverride}
      />

      <Pressable onPress={pause} style={styles.playPauseOverlay} />
    </View>
  )
}

export default function VideoScreen() {
  const [allVideos, setAllVideos] = useState([...videos])
  const [visibleIndex, setvisibleIndex] = useState(0)
  const [pauseOverride, setPauseOverride] = useState(false);

  const pause = () => {
    setPauseOverride(!pauseOverride)
  }


  const onViewableItemsChanged = (event: any) => {
    const newIndex = Number(event?.viewableItems?.at(-1).key);
    setvisibleIndex(newIndex)
  }

  return (
    <View style={styles.container}>
      <FlatList
        pagingEnabled={true}
        data={allVideos}
        renderItem={(data) => {
          return <ViedeoWrapper
            data={data}
            allVideos={allVideos}
            visibleIndex={visibleIndex}
            pause={pause}
            pauseOverride={pauseOverride}
          />
        }}
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      {
        pauseOverride && (
          <Pressable style={styles.pauseButtonContainer}>
            <Image source='pause' contentFit={'contain'} style={styles.pauseButton} />
          </Pressable>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  videoWrapper: {
    height,
    width,
  },
  videoStyle: {
    height,
    width,
  },
  playPauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.2
  },
  pauseButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: (height / 2) - (_imageSize / 2),
  },
  pauseButton: {
    height: _imageSize,
    width: _imageSize,
    justifyContent: 'center',
    alignItems: 'center',
  }
});