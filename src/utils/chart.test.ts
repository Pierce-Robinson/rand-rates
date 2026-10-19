import { buildChartGeometry } from '@/utils/chart';

describe('buildChartGeometry', () => {
  it('maps the lowest value to the bottom and the highest to the top, inside the padding', () => {
    const { line, lastPoint } = buildChartGeometry([1, 3, 2], 200, 100, 10);

    expect(line).toBe('M0,90 L100,10 L200,50');
    expect(lastPoint).toEqual({ x: 200, y: 50 });
  });

  it('closes the area path along the bottom edge', () => {
    const { area } = buildChartGeometry([1, 2], 100, 50, 0);
    expect(area).toBe('M0,50 L100,0 L100,50 L0,50 Z');
  });

  it('draws a flat series through the middle', () => {
    const { line } = buildChartGeometry([5, 5, 5], 100, 60);
    expect(line).toBe('M0,30 L50,30 L100,30');
  });

  it('returns empty paths when there is nothing to draw', () => {
    expect(buildChartGeometry([], 100, 100).line).toBe('');
    expect(buildChartGeometry([1, 2], 0, 100).lastPoint).toBeNull();
  });
});
