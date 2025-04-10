"use client";

import { useState } from "react";
import { Calendar, Clock, User, MapPin, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface Meeting {
  id: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    leadName: "Sarah Johnson",
    leadTitle: "Wound Care Specialist",
    leadCompany: "Memorial Health Center",
    date: "2023-06-25",
    time: "10:00 AM",
    location: "Zoom",
    notes: "Discuss wound care tracking solutions"
  },
  {
    id: "2",
    leadName: "Michael Rodriguez",
    leadTitle: "Director of Nursing",
    leadCompany: "Coastal Home Health Services",
    date: "2023-06-28",
    time: "2:00 PM",
    location: "In-person (San Diego office)"
  }
];

export default function MeetingsView({ agentId }: { agentId: string }) {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>
      
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{meeting.leadName}</h3>
                  <p className="text-gray-600">{meeting.leadTitle} at {meeting.leadCompany}</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{meeting.date}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{meeting.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>
                  
                  {meeting.notes && (
                    <div className="mt-3 text-sm">
                      <p className="text-gray-700">{meeting.notes}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {meetings.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No meetings scheduled</h3>
            <p className="text-gray-500 mt-1">Schedule a meeting with a lead</p>
            <Button variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}