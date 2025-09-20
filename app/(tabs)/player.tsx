import {
  useVideoPlayer,
  VideoView
} from 'expo-video';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

const videoSource = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const { width } = Dimensions.get('window')

function Player() {
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        fullscreenOptions={{
          enable: true,
          orientation: 'landscapeRight',
          autoExitOnRotate: true
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: (width * 9) / 16,
    backgroundColor: '#000',
  },
});


export default Player