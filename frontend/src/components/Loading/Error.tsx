import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

export function EventsError() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>There was a problem loading the trading events. Please try again.</AlertDescription>
      </Alert>
    </div>
  )
}

