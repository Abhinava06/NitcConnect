import { hallVenues } from "./venues";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HallBookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Hall Booking</h1>
        <div className="grid gap-6">
          {hallVenues.map((venue) => (
            <Card key={venue.name} className="p-6 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2 text-blue-800">{venue.name}</h2>
                <p className="mb-1"><span className="font-semibold">Category:</span> {venue.category}</p>
                <p className="mb-1"><span className="font-semibold">Location:</span> {venue.location}</p>
                <p className="mb-1"><span className="font-semibold">Primary Use:</span> {venue.use}</p>
                <p className="mb-1"><span className="font-semibold">Capacity:</span> {venue.capacity}</p>
              </div>
              <Button className="bg-blue-600 text-white px-6 py-2 rounded">Book</Button>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
