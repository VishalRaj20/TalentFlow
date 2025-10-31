import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';

const stageColors = {
  applied: 'bg-blue-800',
  screen: 'bg-yellow-800',
  tech: 'bg-purple-800',
  offer: 'bg-green-800',
  hired: 'bg-emerald-800',
  rejected: 'bg-red-800',
};

const CandidateCard = ({ candidate, index }) => (
  <Draggable draggableId={candidate.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="p-3 mb-3 bg-gray-800 rounded-lg shadow-md border border-gray-700"
      >
        <Link to={`/candidates/${candidate.id}`} className="hover:underline">
          <h4 className="font-medium text-gray-100">{candidate.name}</h4>
          <p className="text-sm text-gray-400 truncate">{candidate.email}</p>
        </Link>
      </div>
    )}
  </Draggable>
);

const KanbanColumn = ({ stage, candidates = [] }) => (
  <div className="w-64 md:w-72 lg:w-80 flex-shrink-0">
    <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-700">
        <span className={`w-3 h-3 rounded-full ${stageColors[stage.id]}`}></span>
        <h3 className="font-semibold text-lg text-gray-100 uppercase tracking-wider">
          {stage.title}
        </h3>
        <span className="ml-auto text-sm font-bold text-gray-400 bg-gray-700 rounded-full px-2 py-0.5">
          {candidates.length}
        </span>
      </div>
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-700' : 'bg-transparent'
            }`}
          >
            {candidates.map((cand, index) => (
              <CandidateCard key={cand.id} candidate={cand} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  </div>
);

export default function CandidateKanban({ stages, candidatesByStage, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            candidates={candidatesByStage[stage.id]}
          />
        ))}
      </div>
    </DragDropContext>
  );
}