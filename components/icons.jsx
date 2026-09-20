const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function makeIcon(defaultSize, paths) {
  return function Icon({ size = defaultSize, ...rest }) {
    return (
      <svg {...base} width={size} height={size} {...rest}>
        {paths}
      </svg>
    );
  };
}

export const IconHome = makeIcon(20, (
  <>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5h4a1 1 0 0 0 1-1v-9" />
  </>
));

export const IconCart = makeIcon(20, (
  <>
    <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
  </>
));

export const IconUser = makeIcon(20, (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </>
));

export const IconLock = makeIcon(28, (
  <>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>
));

export const IconSettings = makeIcon(18, (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V19a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </>
));

export const IconMapPin = makeIcon(18, (
  <>
    <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>
));

export const IconCheck = makeIcon(16, <path d="M20 6 9 17l-5-5" />);

export const IconCheckCircle = makeIcon(28, (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9" />
  </>
));

export const IconX = makeIcon(16, (
  <>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </>
));

export const IconBottle = makeIcon(28, (
  <>
    <path d="M9 2h6" />
    <path d="M10 2v4.5L6.5 12A4 4 0 0 0 10 19h4a4 4 0 0 0 3.5-7L14 6.5V2" />
  </>
));
