import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '../theme/useAppTheme';

export default function PodcastIllustration({ width = 200, height = 200 }) {
  const { colors } = useAppTheme();

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0.15" />
        </LinearGradient>
        <LinearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} />
          <Stop offset="100%" stopColor={colors.secondary} />
        </LinearGradient>
      </Defs>

      {/* Background circle */}
      <Circle cx="100" cy="100" r="90" fill="url(#circleGrad)" />

      {/* Sound waves */}
      <Path d="M 40 100 Q 40 70 40 100 Q 40 130 40 100" stroke={colors.primary} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />
      <Path d="M 30 100 L 30 100" stroke={colors.primary} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      <Rect x="28" y="85" width="4" height="30" rx="2" fill={colors.primary} opacity="0.5" />
      <Rect x="38" y="75" width="4" height="50" rx="2" fill={colors.primary} opacity="0.6" />
      <Rect x="160" y="75" width="4" height="50" rx="2" fill={colors.secondary} opacity="0.6" />
      <Rect x="170" y="85" width="4" height="30" rx="2" fill={colors.secondary} opacity="0.5" />

      {/* Headphone band */}
      <Path
        d="M 55 100 A 45 45 0 0 1 145 100"
        stroke="url(#headphoneGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left ear cup */}
      <Rect x="45" y="95" width="22" height="38" rx="11" fill="url(#headphoneGrad)" />

      {/* Right ear cup */}
      <Rect x="133" y="95" width="22" height="38" rx="11" fill="url(#headphoneGrad)" />

      {/* Center mic/play dot */}
      <Circle cx="100" cy="118" r="14" fill={colors.background} />
      <Path d="M 95 111 L 108 118 L 95 125 Z" fill={colors.primary} />
    </Svg>
  );
}