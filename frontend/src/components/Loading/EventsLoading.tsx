import { EventLoadingSkeleton } from "./EventsLoadingSkeleton"

export function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <h2 className="text-2xl font-bold text-foreground">Loading Events</h2>
      </div>
      <EventLoadingSkeleton />
    </div>
  )
}

