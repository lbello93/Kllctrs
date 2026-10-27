export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-[#f4f3fb]">
      {/* Header skeleton */}
      <div className="bg-white border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-7 w-40 bg-violet-100 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-violet-50 rounded-lg animate-pulse mt-2" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="bg-white border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-3">
          <div className="h-9 flex-1 bg-violet-50 rounded-xl animate-pulse" />
          <div className="h-9 w-24 bg-violet-50 rounded-xl animate-pulse" />
          <div className="h-9 w-36 bg-violet-50 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map placeholder */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl bg-white border border-violet-100 animate-pulse"
              style={{ height: "560px" }}
            >
              <div className="h-full w-full bg-violet-50 rounded-2xl flex items-center justify-center">
                <div className="text-violet-200">
                  <svg
                    className="w-12 h-12 animate-spin-slow"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* List skeletons */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-violet-100 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-5 w-10 bg-violet-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-16 bg-violet-50 rounded-lg animate-pulse" />
                </div>
                <div className="h-4 w-3/4 bg-violet-100 rounded-lg animate-pulse mb-2" />
                <div className="h-3 w-1/2 bg-violet-50 rounded-lg animate-pulse mb-2" />
                <div className="h-3 w-2/3 bg-violet-50 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
