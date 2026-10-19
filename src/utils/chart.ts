export type ChartGeometry = {
  /** SVG path for the line. */
  line: string;
  /** SVG path for the filled area under the line. */
  area: string;
  /** Position of the last point, for the end-of-line dot. */
  lastPoint: { x: number; y: number } | null;
};

/**
 * Turns a series of values into SVG paths that fill a width x height box, leaving `padding`
 * pixels at the top and bottom so the line never touches the edge. A flat series is drawn
 * through the middle.
 */
export function buildChartGeometry(values: number[], width: number, height: number, padding = 8): ChartGeometry {
  if (values.length === 0 || width <= 0 || height <= 0) {
    return { line: '', area: '', lastPoint: null };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const usableHeight = height - padding * 2;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;

  const points = values.map((value, index) => ({
    x: round(values.length > 1 ? index * stepX : width / 2),
    y: round(range === 0 ? height / 2 : padding + (1 - (value - min) / range) * usableHeight),
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L${last.x},${height} L${first.x},${height} Z`;

  return { line, area, lastPoint: last };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
