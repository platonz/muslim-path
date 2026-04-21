/**
 * KaabaWatermark — three-quarter isometric SVG illustration.
 * Built from flat SVG polygons only — no gradients, no filters, no 3D lib.
 * Purely decorative; aria-hidden and pointer-events:none always.
 *
 * Props:
 *   opacity  — default 0.12 (subtle watermark level)
 *   fixed    — if true, positions fixed to viewport (root layout use);
 *              if false, positions absolute within parent (card use)
 *   size     — CSS width string, default "min(460px, 72vw)"
 */
export default function KaabaWatermark({
  opacity = 0.12,
  fixed = true,
  size = "min(460px, 72vw)",
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: fixed ? "fixed" : "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: size,
        pointerEvents: "none",
        zIndex: 0,
        userSelect: "none",
      }}
    >
      {/*
        viewBox: 0 0 600 500
        All geometry in a single <g> translated to center (300, 258).
        Draw order: ground → top → right → front → hizam → door → seams → mataf
      */}
      <svg
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", opacity, display: "block" }}
      >
        <g transform="translate(300, 258)">

          {/* ── Ground shadow ── */}
          <ellipse cx="15" cy="122" rx="170" ry="16" fill="#8a6020" opacity="0.25" />

          {/* ── Top face (flat parallelogram, darkest) ── */}
          <polygon
            points="-130,-105  70,-105  160,-132  40,-132"
            fill="#5a3a10"
            opacity="0.92"
          />

          {/* ── Roof edge — thin ridge between top and front ── */}
          <polygon
            points="-130,-100  70,-100  70,-105  -130,-105"
            fill="#6b4a15"
            opacity="1"
          />
          <polygon
            points="70,-100  160,-128  160,-132  70,-105"
            fill="#6b4a15"
            opacity="0.85"
          />

          {/* ── Right side face (in shadow) ── */}
          <polygon
            points="70,-100  160,-128  160,82  70,110"
            fill="#2a1a04"
            opacity="0.95"
          />

          {/* ── Front face (kiswa / black silk covering) ── */}
          <polygon
            points="-130,-100  70,-100  70,110  -130,110"
            fill="#3a2608"
            opacity="0.95"
          />

          {/* ── Hizam band — front face ── */}
          <polygon
            points="-130,-42  70,-42  70,-22  -130,-22"
            fill="#c9a961"
            opacity="0.85"
          />
          {/* ── Hizam band — right face (perspective-skewed) ── */}
          <polygon
            points="70,-42  160,-68  160,-48  70,-22"
            fill="#c9a961"
            opacity="0.68"
          />

          {/* ── Hizam depth lines ── */}
          <line x1="-130" y1="-22" x2="70"  y2="-22" stroke="#8a6020" strokeWidth="0.8" opacity="0.7" />
          <line x1="70"   y1="-22" x2="160" y2="-48" stroke="#8a6020" strokeWidth="0.8" opacity="0.6" />

          {/* ── Hizam calligraphy suggestion (decorative Unicode, not real script) ── */}
          <text
            x="-105" y="-27"
            fontFamily="serif"
            fontSize="7.5"
            fill="#c9a961"
            opacity="0.65"
            letterSpacing="5"
          >
            ا ل ل ه  م ح م د  ا ل ل ه
          </text>

          {/* ── Vertical fabric seams (front face, below Hizam) ── */}
          {[-100, -68, -38, -8].map(x => (
            <line
              key={x}
              x1={x} y1="-22"
              x2={x} y2="110"
              stroke="#c9a961"
              strokeWidth="0.4"
              opacity="0.38"
            />
          ))}

          {/* ── Door frame (Bab al-Kaaba) ── */}
          <rect
            x="14" y="-20"
            width="45" height="130"
            fill="none"
            stroke="#8a6020"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* ── Door fill ── */}
          <rect
            x="15" y="-19"
            width="43" height="128"
            fill="#e8c370"
            opacity="0.92"
          />

          {/* ── Door paneling lines ── */}
          {[0, 1, 2, 3].map(i => (
            <line
              key={i}
              x1={16 + i * 11} y1="-16"
              x2={16 + i * 11} y2="106"
              stroke="#8a6020"
              strokeWidth="0.5"
              opacity="0.35"
            />
          ))}
          {/* Door horizontal crossbar */}
          <line x1="16" y1="42" x2="57" y2="42" stroke="#8a6020" strokeWidth="0.5" opacity="0.4" />

          {/* ── Door handle (small circle, right edge) ── */}
          <circle cx="52" cy="46" r="3.5" fill="#8a6020" opacity="0.75" />

          {/* ── Mataf walkway floor line ── */}
          <line
            x1="-290" y1="114"
            x2="290"  y2="114"
            stroke="#8a6020"
            strokeWidth="1.2"
            opacity="0.80"
          />

          {/* ── Mataf radial tick marks ── */}
          {[-260, -220, -180, -148, 120, 155, 190, 228].map(x => (
            <line
              key={x}
              x1={x}            y1="114"
              x2={x + (x < 0 ? -7 : 7)} y2="121"
              stroke="#8a6020"
              strokeWidth="0.6"
              opacity="0.38"
            />
          ))}

        </g>
      </svg>
    </div>
  );
}
