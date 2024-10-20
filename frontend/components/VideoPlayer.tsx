import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Svg, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

import playVideo from "@/assets/images/icons/playVideo.png";
import { Colors } from '@/constants/colors'

interface VideoPlayerProps {
    uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri }) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus| null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    // Set loading to false when the video is ready to play
    if (status.isLoaded) {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleVideoPress}>
          <View style={[styles.videoContainer, { height: videoHeight }]}>
            <Video
              ref={video}
              style={[styles.video, {height: videoHeight}]}
              source={{ uri }}
              useNativeControls={controlsVisible}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
          </View>
      </TouchableWithoutFeedback>

      {/* Radial Gradient Overlay */}
      {!isPlaying && !isLoading && (
        <View style={[styles.gradientContainer, {height: videoHeight}]}>
          <Svg style={[styles.svg, {height: videoHeight}]}>
            <Defs>
              <RadialGradient id="radialGradient" cx="50%" cy="50%" r="60%">
                <Stop offset="0%" stopColor="rgba(53, 111, 197, 0.1)" stopOpacity={0.22} />
                <Stop offset="100%" stopColor={Colors.defaultBlue} stopOpacity={0.7}/>
              </RadialGradient>
            </Defs>
            <Circle cx="50%" cy="50%" r="70%" fill="url(#radialGradient)" />
          </Svg>
        </View>
      )}
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
  videoContainer: {
    width: Dimensions.get('window').width,
    zIndex: 1,
  },
  video: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    zIndex: 1,
  },
  gradientContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'absolute',
  },
  svg: {
    position: 'absolute',
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
    zIndex: 3,
  },
  playIcon: {
    height: 60,
    width: 60,
  }
});

export default VideoPlayer