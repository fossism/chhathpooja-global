export default function SunriseMark() {
  return (
    <div className="sunrise-mark" aria-hidden="true">
      <svg viewBox="0 0 343 379" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sun-core" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#FFD970" />
            <stop offset="55%" stopColor="#F5B93F" />
            <stop offset="100%" stopColor="#EE8F2A" />
          </radialGradient>
          <mask id="sun-stage-1" maskUnits="userSpaceOnUse" x="0" y="0" width="343" height="379">
            <rect className="sun-wipe sun-wipe--1" x="0" y="0" width="343" height="379" fill="#fff" />
          </mask>
          <mask id="sun-stage-2" maskUnits="userSpaceOnUse" x="0" y="0" width="343" height="379">
            <rect className="sun-wipe sun-wipe--2" x="0" y="0" width="343" height="379" fill="#fff" />
          </mask>
        </defs>

        {/* Stage 1 — sun disc first (like Bodhya circle) */}
        <g mask="url(#sun-stage-1)">
          <circle cx="171" cy="148" r="86" fill="url(#sun-core)" />
          <circle cx="171" cy="148" r="86" fill="none" stroke="#16564F" strokeOpacity="0.18" strokeWidth="2" />
        </g>

        {/* Stage 2 — even rays, uniform length + gap, close together */}
        <g mask="url(#sun-stage-2)" stroke="#E86A2C" strokeWidth="9" strokeLinecap="round">
          <line x1="273.0" y1="148.0" x2="295.0" y2="148.0" />
          <line x1="265.2" y1="187.0" x2="285.6" y2="195.5" />
          <line x1="243.1" y1="220.1" x2="258.7" y2="235.7" />
          <line x1="210.0" y1="242.2" x2="218.5" y2="262.6" />
          <line x1="171.0" y1="250.0" x2="171.0" y2="272.0" />
          <line x1="132.0" y1="242.2" x2="123.5" y2="262.6" />
          <line x1="98.9" y1="220.1" x2="83.3" y2="235.7" />
          <line x1="76.8" y1="187.0" x2="56.4" y2="195.5" />
          <line x1="69.0" y1="148.0" x2="47.0" y2="148.0" />
          <line x1="76.8" y1="109.0" x2="56.4" y2="100.5" />
          <line x1="98.9" y1="75.9" x2="83.3" y2="60.3" />
          <line x1="132.0" y1="53.8" x2="123.5" y2="33.4" />
          <line x1="171.0" y1="46.0" x2="171.0" y2="24.0" />
          <line x1="210.0" y1="53.8" x2="218.5" y2="33.4" />
          <line x1="243.1" y1="75.9" x2="258.7" y2="60.3" />
          <line x1="265.2" y1="109.0" x2="285.6" y2="100.5" />
        </g>

      </svg>
    </div>
  );
}
