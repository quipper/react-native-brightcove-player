import * as React from 'react';
import { ViewStyle } from 'react-native';

export type Props = {
  policyKey: string;
  accountId: string;
  videoId?: string;
  referenceId?: string;
  play?: boolean;
  autoPlay?: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onProgress?: ({ currentTime: number }) => void;
  style?: ViewStyle;
  resizeAspectFill: boolean;
};

export class BrightcovePlayer extends React.Component<Props, {}> {
  seekTo(position: number): {};
}
