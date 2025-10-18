"use client"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { useEffect, useState } from "react"

type HostelTicket = {
  _id: string
  title: string
  type: string
  status: "pending" | "approved"
  createdAt: string
  user?: {
    name: string
    email: string
  }
}

export default function HostelTicketsAdmin() {
  const [tickets, setTickets] = useState<HostelTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/hostel")
        const data = await response.json()
        setTickets(data)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const handleStatusUpdate = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/hostel/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? { ...ticket, status: "approved" } : ticket
      ))
    } catch (error) {
      console.error("Error updating ticket status:", error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hostel Tickets Management</h1>
      <Card>
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : tickets.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No tickets found
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell className="capitalize">{ticket.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={ticket.status === "approved" ? "secondary" : "default"}
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.user?.name}</TableCell>
                    <TableCell>
                      {format(new Date(ticket.createdAt), "PPP")}
                    </TableCell>
                    <TableCell>
                      {ticket.status === "pending" && (
                        <div className="flex space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                                onClick={() => handleStatusUpdate(ticket._id)}
                              >
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Ticket</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve this ticket?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleStatusUpdate(ticket._id)}
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </Card>
    </div>
  )
}