import * as React from 'react';
import { ViewStyle } from 'react-native';

export type Props = {
  policyKey: string;
  accountId: string;
  videoReferenceId: string;
  style?: ViewStyle;
};

export class BrightcovePlayer extends React.Component<Props, {}> {}
