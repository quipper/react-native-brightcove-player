import * as React from 'react';
import { ViewStyle } from 'react-native';

type VideoToken = string;

export type BrightcovePlayerProps = {
  policyKey?: string;
  accountId?: string;
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

export class BrightcovePlayer extends React.Component<
  BrightcovePlayerProps,
  {}
> {
  seekTo(position: number): {};
}

export type BrightcovePlayerPosterProps = {
  policyKey?: string;
  accountId?: string;
  referenceId?: string;
  videoId?: string;
  videoToken?: VideoToken;
  style?: ViewStyle;
};

export class BrightcovePlayerPoster extends React.Component<
  BrightcovePlayerPosterProps,
  {}
> {}

export namespace BrightcovePlayerUtil {
  type PlaylistVideo = {
    accountId: String;
    videoId: String;
    referenceId: String;
    name: String;
    description: String;
    duration: number;
  };

  type OfflineVideoStatus = {
    accountId: string;
    videoId: string;
    downloadProgress: number;
    videoToken: VideoToken;
  };

  export function requestDownloadVideoWithReferenceId(
    accountId: string,
    policyKey: string,
    referenceId: string,
    bitRate?: number
  ): Promise<VideoToken>;

  export function requestDownloadVideoWithVideoId(
    accountId: string,
    policyKey: string,
    videoId: string,
    bitRate?: number
  ): Promise<VideoToken>;

  export function getOfflineVideoStatuses(
    accountId: string,
    policyKey: string
  ): Promise<OfflineVideoStatus[]>;

  export function deleteOfflineVideo(
    accountId: string,
    policyKey: string,
    videoToken: VideoToken
  ): Promise<void>;

  export function getPlaylistWithReferenceId(
    accountId: string,
    policyKey: string,
    referenceId: string
  ): Promise<PlaylistVideo[]>;

  export function getPlaylistWithPlaylistId(
    accountId: string,
    policyKey: string,
    playlistId: string
  ): Promise<PlaylistVideo[]>;

  export function addOfflineNotificationListener(
    callback: (statuses: OfflineVideoStatus[]) => void
  ): Function;
}
