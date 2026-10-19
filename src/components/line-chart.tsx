import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';
import { buildChartGeometry } from '@/utils/chart';

type LineChartProps = {
  values: number[];
  height?: number;
  accessibilityLabel: string;
};

/** Lightweight SVG line chart that sizes itself to its container. */
export function LineChart({ values, height = 180, accessibilityLabel }: LineChartProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const geometry = buildChartGeometry(values, width, height, 12);

  const onLayout = (event: LayoutChangeEvent) => setWidth(Math.round(event.nativeEvent.layout.width));

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { height }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}>
      {width > 0 && geometry.line ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.accent} stopOpacity={0.25} />
              <Stop offset="1" stopColor={theme.accent} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={geometry.area} fill="url(#fill)" />
          <Path d={geometry.line} stroke={theme.accent} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
          {geometry.lastPoint ? (
            <Circle cx={geometry.lastPoint.x} cy={geometry.lastPoint.y} r={4.5} fill={theme.accent} />
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
