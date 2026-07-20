export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
      <g className="brand-book brand-book-top" transform="rotate(-5 22 10)">
        <rect x="9" y="6" width="27" height="7" rx="2" />
        <path d="M13 6v7M32 6v7" />
      </g>
      <g className="brand-book brand-book-middle" transform="rotate(4 22 22)">
        <rect x="6" y="17" width="32" height="8" rx="2" />
        <path d="M11 17v8M33 17v8" />
      </g>
      <g className="brand-book brand-book-bottom" transform="rotate(-2 22 34)">
        <rect x="8" y="29" width="29" height="8" rx="2" />
        <path d="M12 29v8M33 29v8" />
      </g>
      <path className="brand-accent" d="M7 40h31" />
      <path className="brand-bookmark" d="M26.5 18v10l3-2.3 3 2.3V18" />
    </svg>
  );
}
