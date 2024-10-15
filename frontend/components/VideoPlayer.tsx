import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

import playVideo from "@/assets/images/icons/playVideo.png";

interface VideoPlayerProps {
    uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri }) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus| null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const videoHeight = videoDimensions
    ? (screenWidth * videoDimensions.height) / videoDimensions.width // Maintain aspect ratio
    : screenWidth * (9 / 16); // Default aspect ratio if dimensions are not available

const handlePlayPause = async () => {
    if (isPlaying) {
        await video.current?.pauseAsync();
    } else {
        await video.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
    };

const handleVideoPress = () => {
    setControlsVisible((prev) => !prev); // Toggle controls visibility on video press
};


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleVideoPress}>
          <Video
            ref={video}
            style={[styles.video, { height: videoHeight }]}
            source={{ uri }}
            useNativeControls={controlsVisible}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={setStatus}
          />
      </TouchableWithoutFeedback>
      {!isPlaying && (
        <View style={styles.playButtonContainer}>
            <TouchableOpacity onPress={handlePlayPause}>
                <Image source={playVideo} style={styles.playIcon}/>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
  },
  playButtonContainer: {
    position: 'absolute',
    left: '50%',
        top: '50%', // Center vertically as well
        transform: [
            { translateX: -30 }, // Adjust based on your icon size
            { translateY: -30 }  // Center vertically; adjust for icon height
        ],
  },
  playIcon: {
    height: 60,
    width: 60,
  }
});

export default VideoPlayer