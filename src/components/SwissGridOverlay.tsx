import React from 'react';

export interface SwissGridConfig {
  showColumns: boolean;
  columnCount: 6 | 12;
  showGutters: boolean;
  showMargins: boolean;
  showRows: boolean;
  showBaseline: boolean;
  showLabels: boolean;
  opacity: number;
}

export const DEFAULT_SWISS_GRID_CONFIG: SwissGridConfig = {
  showColumns: true,
  columnCount: 6,
  showGutters: true,
  showMargins: true,
  showRows: true,
  showBaseline: false,
  showLabels: true,
  opacity: 0.85,
};

interface SwissGridOverlayProps {
  widthMm?: number;
  heightMm?: number;
  marginMm?: number;
  config?: Partial<SwissGridConfig>;
  activeElementCoords?: { x: number; y: number; width: number; height: number } | null;
}

export const SwissGridOverlay: React.FC<SwissGridOverlayProps> = ({
  widthMm = 594,
  heightMm = 841,
  marginMm = 48,
  config = {},
  activeElementCoords = null,
}) => {
  const mergedConfig: SwissGridConfig = { ...DEFAULT_SWISS_GRID_CONFIG, ...config };
  const {
    showColumns,
    columnCount,
    showGutters,
    showMargins,
    showRows,
    showBaseline,
    showLabels,
    opacity,
  } = mergedConfig;

  const contentWidth = widthMm - marginMm * 2; // 498mm
  const contentHeight = heightMm - marginMm * 2; // 745mm

  // Columns & Gutters calculation
  const gutterWidth = columnCount === 6 ? 8 : 4;
  const totalGuttersWidth = (columnCount - 1) * gutterWidth;
  const colWidth = (contentWidth - totalGuttersWidth) / columnCount;

  // Modular rows calculation (6 horizontal modules for Swiss grid)
  const rowCount = 6;
  const rowGutterHeight = 8;
  const totalRowGutters = (rowCount - 1) * rowGutterHeight;
  const rowHeight = (contentHeight - totalRowGutters) / rowCount;

  // Baseline intervals (24mm)
  const baselineInterval = 24;
  const baselineLinesCount = Math.floor(contentHeight / baselineInterval);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-30 transition-opacity duration-150"
      viewBox={`0 0 ${widthMm} ${heightMm}`}
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      <defs>
        {/* Striped pattern for gutter highlight */}
        <pattern
          id="swiss-gutter-hatch"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="4"
            stroke="rgba(244, 63, 94, 0.25)"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      {/* Margin Safe Zone Outer Boundary */}
      {showMargins && (
        <g id="swiss-margins">
          {/* Subtle perimeter shading outside safe margin */}
          <path
            d={`M 0,0 L ${widthMm},0 L ${widthMm},${heightMm} L 0,${heightMm} Z M ${marginMm},${marginMm} L ${marginMm},${heightMm - marginMm} L ${widthMm - marginMm},${heightMm - marginMm} L ${widthMm - marginMm},${marginMm} Z`}
            fill="rgba(15, 23, 42, 0.45)"
            fillRule="evenodd"
          />

          {/* Safe Margins Border Box */}
          <rect
            x={marginMm}
            y={marginMm}
            width={contentWidth}
            height={contentHeight}
            fill="none"
            stroke="#0284c7"
            strokeWidth="0.75"
            strokeDasharray="5 3"
          />

          {/* Corner Crosshairs */}
          {[
            { cx: marginMm, cy: marginMm },
            { cx: widthMm - marginMm, cy: marginMm },
            { cx: marginMm, cy: heightMm - marginMm },
            { cx: widthMm - marginMm, cy: heightMm - marginMm },
          ].map((pt, i) => (
            <g key={`corner-${i}`}>
              <line
                x1={pt.cx - 6}
                y1={pt.cy}
                x2={pt.cx + 6}
                y2={pt.cy}
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <line
                x1={pt.cx}
                y1={pt.cy - 6}
                x2={pt.cx}
                y2={pt.cy + 6}
                stroke="#38bdf8"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Margin Dimension Tags */}
          {showLabels && (
            <>
              <text
                x={marginMm + 3}
                y={marginMm - 8}
                fill="#38bdf8"
                fontSize="6"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
                letterSpacing="0.05em"
              >
                SWISS SAFE MARGIN: {marginMm}mm
              </text>
              <text
                x={widthMm - marginMm - 3}
                y={marginMm - 8}
                textAnchor="end"
                fill="#38bdf8"
                fontSize="6"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="500"
              >
                A1 POSTER (594 × 841 mm)
              </text>
            </>
          )}
        </g>
      )}

      {/* Horizontal Baseline Grid Lines */}
      {showBaseline && (
        <g id="swiss-baseline-grid">
          {Array.from({ length: baselineLinesCount }).map((_, i) => {
            const y = marginMm + (i + 1) * baselineInterval;
            return (
              <line
                key={`baseline-${i}`}
                x1={marginMm}
                y1={y}
                x2={widthMm - marginMm}
                y2={y}
                stroke="rgba(99, 102, 241, 0.18)"
                strokeWidth="0.3"
              />
            );
          })}
        </g>
      )}

      {/* Modular Horizontal Rows (Swiss Hang-lines / Fields) */}
      {showRows && (
        <g id="swiss-modular-rows">
          {Array.from({ length: rowCount }).map((_, rIdx) => {
            const rY = marginMm + rIdx * (rowHeight + rowGutterHeight);
            return (
              <g key={`row-${rIdx}`}>
                {/* Row Band Guide */}
                <line
                  x1={marginMm}
                  y1={rY}
                  x2={widthMm - marginMm}
                  y2={rY}
                  stroke="rgba(14, 165, 233, 0.4)"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1={marginMm}
                  y1={rY + rowHeight}
                  x2={widthMm - marginMm}
                  y2={rY + rowHeight}
                  stroke="rgba(14, 165, 233, 0.4)"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />

                {/* Horizontal Gutter between rows */}
                {rIdx < rowCount - 1 && (
                  <rect
                    x={marginMm}
                    y={rY + rowHeight}
                    width={contentWidth}
                    height={rowGutterHeight}
                    fill="rgba(244, 63, 94, 0.05)"
                  />
                )}

                {/* Row Label */}
                {showLabels && (
                  <text
                    x={marginMm - 6}
                    y={rY + rowHeight / 2 + 2}
                    textAnchor="end"
                    fill="#38bdf8"
                    fontSize="5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    R{rIdx + 1}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* Vertical Columns & Gutters */}
      {showColumns && (
        <g id="swiss-columns">
          {Array.from({ length: columnCount }).map((_, cIdx) => {
            const colX = marginMm + cIdx * (colWidth + gutterWidth);
            const gutterX = colX + colWidth;

            return (
              <g key={`col-${cIdx}`}>
                {/* Column Column Surface Tint */}
                <rect
                  x={colX}
                  y={marginMm}
                  width={colWidth}
                  height={contentHeight}
                  fill="rgba(14, 165, 233, 0.04)"
                  stroke="rgba(56, 189, 248, 0.25)"
                  strokeWidth="0.5"
                />

                {/* Column Center Axis Hairline */}
                <line
                  x1={colX + colWidth / 2}
                  y1={marginMm}
                  x2={colX + colWidth / 2}
                  y2={marginMm + contentHeight}
                  stroke="rgba(56, 189, 248, 0.15)"
                  strokeWidth="0.3"
                  strokeDasharray="2 4"
                />

                {/* Column Label at Top Margin */}
                {showLabels && (
                  <g>
                    <text
                      x={colX + colWidth / 2}
                      y={marginMm - 8}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="6.5"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      COL {cIdx + 1}
                    </text>
                    <text
                      x={colX + colWidth / 2}
                      y={marginMm - 2}
                      textAnchor="middle"
                      fill="#7dd3fc"
                      fontSize="4.5"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {colWidth.toFixed(1)}mm
                    </text>
                  </g>
                )}

                {/* Vertical Column Gutter (between columns) */}
                {cIdx < columnCount - 1 && showGutters && (
                  <g key={`gutter-${cIdx}`}>
                    <rect
                      x={gutterX}
                      y={marginMm}
                      width={gutterWidth}
                      height={contentHeight}
                      fill="url(#swiss-gutter-hatch)"
                    />
                    <line
                      x1={gutterX}
                      y1={marginMm}
                      x2={gutterX}
                      y2={marginMm + contentHeight}
                      stroke="rgba(244, 63, 94, 0.3)"
                      strokeWidth="0.4"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={gutterX + gutterWidth}
                      y1={marginMm}
                      x2={gutterX + gutterWidth}
                      y2={marginMm + contentHeight}
                      stroke="rgba(244, 63, 94, 0.3)"
                      strokeWidth="0.4"
                      strokeDasharray="2 2"
                    />
                    {showLabels && (
                      <text
                        x={gutterX + gutterWidth / 2}
                        y={marginMm - 3}
                        textAnchor="middle"
                        fill="#f43f5e"
                        fontSize="4"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {gutterWidth}mm
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* Golden Section & Center Crosshair Guideline */}
      <line
        x1={widthMm / 2}
        y1={0}
        x2={widthMm / 2}
        y2={heightMm}
        stroke="rgba(232, 121, 249, 0.4)"
        strokeWidth="0.6"
        strokeDasharray="6 4"
      />
      <line
        x1={0}
        y1={heightMm / 2}
        x2={widthMm}
        y2={heightMm / 2}
        stroke="rgba(232, 121, 249, 0.4)"
        strokeWidth="0.6"
        strokeDasharray="6 4"
      />

      {/* Selected Element Live Snapping Guides (if an element is active) */}
      {activeElementCoords && (
        <g id="element-alignment-guides">
          {/* Vertical alignment line for element Left edge */}
          <line
            x1={activeElementCoords.x}
            y1={0}
            x2={activeElementCoords.x}
            y2={heightMm}
            stroke="#38bdf8"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
          {/* Vertical alignment line for element Right edge */}
          <line
            x1={activeElementCoords.x + activeElementCoords.width}
            y1={0}
            x2={activeElementCoords.x + activeElementCoords.width}
            y2={heightMm}
            stroke="#38bdf8"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
          {/* Horizontal alignment line for element Top edge */}
          <line
            x1={0}
            y1={activeElementCoords.y}
            x2={widthMm}
            y2={activeElementCoords.y}
            stroke="#38bdf8"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />

          {/* Coordinate callout pill */}
          <rect
            x={Math.min(activeElementCoords.x, widthMm - 140)}
            y={Math.max(activeElementCoords.y - 14, 4)}
            width="135"
            height="11"
            rx="2"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="0.5"
          />
          <text
            x={Math.min(activeElementCoords.x, widthMm - 140) + 4}
            y={Math.max(activeElementCoords.y - 14, 4) + 8}
            fill="#e0f2fe"
            fontSize="5.5"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            X: {Math.round(activeElementCoords.x)}mm · Y: {Math.round(activeElementCoords.y)}mm · W: {Math.round(activeElementCoords.width)}mm
          </text>
        </g>
      )}
    </svg>
  );
};
