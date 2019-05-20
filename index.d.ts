import * as React from 'react';
import { ViewStyle } from 'react-native';

type VideoToken = string;

export type Props = {
  policyKey: string;
  accountId: string;
  referenceId?: string;
  videoId?: string;
  videoToken?: VideoToken;
  autoPlay?: boolean;
  play?: boolean;
  fullscreen?: boolean;
  disableDefaultControl?: boolean;
  volume?: number;
  bitRate?: number;
  playbackRate?: number;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onProgress?: ({ currentTime: number }) => void;
  onChangeDuration?: ({ duration: number }) => void;
  onUpdateBufferProgress?: ({ bufferProgress: number }) => void;
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
  style?: ViewStyle;
};

export class BrightcovePlayer extends React.Component<Props, {}> {
  seekTo(position: number): {};
}

export namespace BrightcovePlayerUtil {
  export function requestDownloadVideoByReferenceId(
    accountId: string,
    policyKey: string,
    referenceId: string,
    bitRate?: number
  ): Promise<VideoToken>;
  export function requestDownloadVideoByVideoId(
    accountId: string,
    policyKey: string,
    videoId: string,
    bitRate?: number
  ): Promise<VideoToken>;
  export function getOfflineVideoStatuses(): Promise<
    {
      downloadProgress: number;
      videoToken: VideoToken;
    }[]
  >;
  export function deleteOfflineVideo(videoToken: VideoToken): Promise<void>;
}
