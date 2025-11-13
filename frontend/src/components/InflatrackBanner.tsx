export const InflatrackBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <a
          href="https://inflatrack.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 hover:opacity-80 transition-opacity group"
        >
          {/* "Developed by" text */}
          <span className="text-sm text-gray-600">Developed by</span>

          {/* Logo Image (replacing "Inflatrack" text) */}
          <img
            src="/Inflatrack_001.png"
            alt="Inflatrack"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              console.error('Failed to load Inflatrack logo. Make sure Inflatrack_001.png is in the public folder.');
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* External link icon */}
          <svg
            className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};
