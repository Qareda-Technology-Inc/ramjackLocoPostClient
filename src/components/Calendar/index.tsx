import React from 'react';
import "@/assets/css/vendors/full-calendar.css";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CalendarOptions } from "@fullcalendar/core";
import { Assignment } from '@/types/assignment';

interface CalendarProps {
  assignments: Assignment[];
}

function Main({ assignments }: CalendarProps) {
  const events = assignments.map(assignment => ({
    title: assignment.site.name,
    start: new Date(assignment.startDate).toISOString(),
    end: new Date(assignment.endDate).toISOString(),
  }));

  console.log('Calendar events:', events); // Log the events array

  const options: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    droppable: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialDate: new Date().toISOString().split('T')[0], // Set to today's date
    navLinks: true,
    editable: true,
    dayMaxEvents: true,
    events: events, // Use the mapped events
    drop: function (info) {
      if (
        document.querySelectorAll("#checkbox-events").length &&
        (document.querySelectorAll("#checkbox-events")[0] as HTMLInputElement)
          ?.checked
      ) {
        (info.draggedEl.parentNode as HTMLElement).remove();
        if (
          document.querySelectorAll("#calendar-events")[0].children.length == 1
        ) {
          document
            .querySelectorAll("#calendar-no-events")[0]
            .classList.remove("hidden");
        }
      }
    },
  };

  return (
    <div className="full-calendar">
      <FullCalendar {...options} />
    </div>
  );
}

export default Main;
