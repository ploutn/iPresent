import { ResponsiveCard, ResponsiveText } from "../components/ResponsiveCard";
import { useResponsive } from "../hooks/useResponsive";

export const HomePage = () => {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className="container-responsive py-6">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-responsive-3xl font-bold text-foreground">
            Welcome to iPresent
          </h1>
          <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive presentation management system for churches and
            organizations
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid-responsive-3 gap-responsive">
          <ResponsiveCard className="card-responsive hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-responsive-lg font-semibold">Songs</h3>
                <ResponsiveText className="text-muted-foreground">
                  Manage your worship songs and lyrics
                </ResponsiveText>
              </div>
            </div>
          </ResponsiveCard>

          <ResponsiveCard className="card-responsive hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-responsive-lg font-semibold">Bible</h3>
                <ResponsiveText className="text-muted-foreground">
                  Access scripture passages and verses
                </ResponsiveText>
              </div>
            </div>
          </ResponsiveCard>

          <ResponsiveCard className="card-responsive hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-responsive-lg font-semibold">Media</h3>
                <ResponsiveText className="text-muted-foreground">
                  Manage videos, images, and presentations
                </ResponsiveText>
              </div>
            </div>
          </ResponsiveCard>
        </div>

        {/* Recent Activity */}
        <ResponsiveCard className="card-responsive-lg">
          <div className="space-y-4">
            <h2 className="text-responsive-xl font-semibold">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex-responsive-between p-responsive-sm bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <ResponsiveText className="font-medium">
                    Sunday Service Playlist
                  </ResponsiveText>
                  <ResponsiveText className="text-muted-foreground text-responsive-xs">
                    Updated 2 hours ago
                  </ResponsiveText>
                </div>
                {!isMobile && (
                  <div className="text-responsive-xs text-muted-foreground">
                    12 songs
                  </div>
                )}
              </div>

              <div className="flex-responsive-between p-responsive-sm bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <ResponsiveText className="font-medium">
                    Welcome Announcement
                  </ResponsiveText>
                  <ResponsiveText className="text-muted-foreground text-responsive-xs">
                    Created yesterday
                  </ResponsiveText>
                </div>
                {!isMobile && (
                  <div className="text-responsive-xs text-muted-foreground">
                    Active
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResponsiveCard>

        {/* Quick Stats */}
        {!isMobile && (
          <div className="grid-responsive-4 gap-responsive">
            <div className="text-center p-responsive bg-card border border-border rounded-lg">
              <div className="text-responsive-2xl font-bold text-primary">
                24
              </div>
              <ResponsiveText className="text-muted-foreground">
                Songs
              </ResponsiveText>
            </div>
            <div className="text-center p-responsive bg-card border border-border rounded-lg">
              <div className="text-responsive-2xl font-bold text-primary">
                8
              </div>
              <ResponsiveText className="text-muted-foreground">
                Playlists
              </ResponsiveText>
            </div>
            <div className="text-center p-responsive bg-card border border-border rounded-lg">
              <div className="text-responsive-2xl font-bold text-primary">
                156
              </div>
              <ResponsiveText className="text-muted-foreground">
                Bible Verses
              </ResponsiveText>
            </div>
            <div className="text-center p-responsive bg-card border border-border rounded-lg">
              <div className="text-responsive-2xl font-bold text-primary">
                12
              </div>
              <ResponsiveText className="text-muted-foreground">
                Media Files
              </ResponsiveText>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
