import * as React from 'react';
import { ViewStyle } from 'react-native';

export type Props = {
  policyKey: string;
  accountId: string;
  referenceId?: string;
  videoId?: string;
  autoPlay?: boolean;
  play?: boolean;
  fullscreen?: boolean;
  disableDefaultControl?: boolean;
  volume?: number;
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
  resizeAspectFill: boolean;
};

export class BrightcovePlayer extends React.Component<Props, {}> {
  seekTo(position: number): {};
}
