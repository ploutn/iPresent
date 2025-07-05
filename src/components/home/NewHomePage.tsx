
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Users, Clapperboard, Radio, Settings, Plus, Search } from "lucide-react";

const QuickAccessButton = ({ icon: Icon, label, ...props }) => (
  <Button variant="ghost" className="flex flex-col items-center justify-center h-24 w-24 rounded-lg bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors duration-200" {...props}>
    <Icon className="w-8 h-8 mb-2 text-primary" />
    <span className="text-sm font-medium text-foreground">{label}</span>
  </Button>
);

export function NewHomePage() {
  return (
    <div className="p-8 bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-lg text-muted-foreground mt-1">Here's a snapshot of your iPresent workspace.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Search Library
          </Button>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-5 h-5 mr-2" />
            Create New
          </Button>
        </div>
      </header>

      {/* Quick Access Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <QuickAccessButton icon={Zap} label="Go Live" />
          <QuickAccessButton icon={Users} label="Schedule" />
          <QuickAccessButton icon={Clapperboard} label="Media" />
          <QuickAccessButton icon={Radio} label="Songs" />
          <QuickAccessButton icon={Settings} label="Settings" />
        </div>
      </section>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Presentations */}
        <Card className="col-span-1 lg:col-span-2 bg-card rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Presentations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent presentations found.</p>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-card rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No upcoming events scheduled.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
