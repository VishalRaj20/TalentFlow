import React from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import JobCard from "./JobCard";

export default function JobsList({ jobs, onEdit, onArchive, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="jobs-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 p-2 bg-gray-100 rounded-lg min-h-[200px] dark:bg-gray-900"
          >
            {jobs.map((job, idx) => (
              <Draggable key={job.id} draggableId={job.id} index={idx}>
                {(providedDr) => (
                  <div
                    ref={providedDr.innerRef}
                    {...providedDr.draggableProps}
                    {...providedDr.dragHandleProps}
                  >
                    <JobCard
                      job={job}
                      onEdit={onEdit}
                      onArchive={onArchive}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}