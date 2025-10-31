import React, { useState } from "react";

const DragHandleIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path d="M7 2a2 2 0 100 4 2 2 0 000-4zM3 2a2 2 0 100 4 2 2 0 000-4zM7 8a2 2 0 100 4 2 2 0 000-4zM3 8a2 2 0 100 4 2 2 0 000-4zM7 14a2 2 0 100 4 2 2 0 000-4zM3 14a2 2 0 100 4 2 2 0 000-4zM12 2a2 2 0 100 4 2 2 0 000-4zM16 2a2 2 0 100 4 2 2 0 000-4zM12 8a2 2 0 100 4 2 2 0 000-4zM16 8a2 2 0 100 4 2 2 0 000-4zM12 14a2 2 0 100 4 2 2 0 000-4zM16 14a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);
const TrashIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.54 0c-.269.035-.53.069-.79.1v-2.175A2.25 2.25 0 015.607 2h12.786a2.25 2.25 0 012.25 2.25v2.175c-.26.031-.52.065-.79.1m-12.54 0H12m4.21 0H12m0 0l-1.106-1.106a1.5 1.5 0 010-2.121l.158-.158a1.5 1.5 0 012.122 0l.158.158a1.5 1.5 0 010 2.121L12 5.684z" />
  </svg>
);
const PlusIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const newId = () => "id-" + Math.random().toString(36).slice(2);

export default function AssessmentBuilder({ assessment, setAssessment }) {
  if (!assessment) return <div>No assessment</div>;

  function updateData(field, value) {
    setAssessment({
      ...assessment,
      data: { ...assessment.data, [field]: value },
    });
  }
  function updateQuestion(sectionId, questionId, field, value) {
    setAssessment(current => ({
      ...current,
      data: {
        ...current.data,
        sections: current.data.sections.map(s =>
          s.id === sectionId
            ? { ...s, questions: s.questions.map(q => q.id === questionId ? { ...q, [field]: value } : q) }
            : s
        ),
      },
    }));
  }
  function addQuestion(sectionId, type) {
    const newQ = {
      id: newId(),
      type,
      label: "New Question",
      required: false,
      options: type === "single" || type === "multi" ? [{ id: newId(), label: "Option 1" }] : [],
    };
    setAssessment(current => ({
      ...current,
      data: {
        ...current.data,
        sections: current.data.sections.map(s =>
          s.id === sectionId
            ? { ...s, questions: [...(s.questions || []), newQ] }
            : s
        ),
      },
    }));
  }
  function removeQuestion(sectionId, questionId) {
    setAssessment(current => ({
      ...current,
      data: {
        ...current.data,
        sections: current.data.sections.map(s =>
          s.id === sectionId
            ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
            : s
        ),
      },
    }));
  }
  function updateOption(sectionId, questionId, optionId, label) {
    setAssessment(current => ({
      ...current,
      data: {
        ...current.data,
        sections: current.data.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                questions: s.questions.map(q =>
                  q.id === questionId
                    ? { ...q, options: (q.options || []).map(opt => opt.id === optionId ? { ...opt, label } : opt) }
                    : q
                ),
              }
            : s
        ),
      },
    }));
  }
  function addOption(sectionId, questionId) {
    setAssessment(current => ({
      ...current,
      data: {
        ...current.data,
        sections: current.data.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                questions: s.questions.map(q =>
                  q.id === questionId
                    ? { ...q, options: [...(q.options || []), { id: newId(), label: `Option ${(q.options || []).length + 1}` }] }
                    : q
                ),
              }
            : s
        ),
      },
    }));
  }
  function removeOption(sectionId, questionId, optionId) {
     setAssessment(current => ({
      ...current,
      data: {
        ...current.data,
        sections: current.data.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                questions: s.questions.map(q =>
                  q.id === questionId
                    ? { ...q, options: (q.options || []).filter(opt => opt.id !== optionId) }
                    : q
                ),
              }
            : s
        ),
      },
    }));
  }

  return (
    <div className="space-y-6">
      <Input
        label="Assessment Title"
        value={assessment.data.title}
        onChange={e => updateData("title", e.target.value)}
        className="text-lg font-semibold"
      />

      {assessment.data.sections.map(s => (
        <div key={s.id} className="p-4 border border-gray-200 rounded-lg space-y-4 dark:border-gray-700">
          <Input
            label="Section Title"
            value={s.title}
            onChange={e => { /* TODO: Implement section title update */ }}
            className="text-xl font-semibold text-gray-800 dark:text-gray-100"
          />
          
          <div className="space-y-4">
            {(s.questions || []).map(q => (
              <QuestionEditor
                key={q.id}
                q={q}
                sId={s.id}
                allQuestions={assessment.data.sections.flatMap(sec => sec.questions || [])}
                update={updateQuestion}
                remove={removeQuestion}
                updateOpt={updateOption}
                addOpt={addOption}
                removeOpt={removeOption}
              />
            ))}
          </div>

          <AddQuestionMenu onAdd={type => addQuestion(s.id, type)} />
        </div>
      ))}
    </div>
  );
}

function QuestionEditor({ q, sId, allQuestions, update, remove, updateOpt, addOpt, removeOpt }) {
  const otherQuestions = (allQuestions || []).filter(aq => aq.id !== q.id);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-700 dark:border-gray-600">
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b rounded-t-lg dark:bg-gray-600 dark:border-gray-500">
        <div className="flex items-center gap-2">
          <DragHandleIcon />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
            {q.type}
          </span>
        </div>
        <button
          onClick={() => remove(sId, q.id)}
          className="text-gray-400 hover:text-red-500"
          title="Remove Question"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <Input
          label="Question Label"
          value={q.label}
          onChange={e => update(sId, q.id, "label", e.target.value)}
        />

        {(q.type === "single" || q.type === "multi") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Options</label>
            {(q.options || []).map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  value={opt.label}
                  onChange={e => updateOpt(sId, q.id, opt.id, e.target.value)}
                  className="flex-grow border rounded-md px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600"
                />
                <button
                  onClick={() => removeOpt(sId, q.id, opt.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Remove Option"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={() => addOpt(sId, q.id)}
              className="flex items-center gap-1 text-sm text-sky-600 hover:underline pt-1"
            >
              <PlusIcon /> Add option
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-600">
          <div className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">Rules</div>
          <div className="grid grid-cols-2 gap-4">
            <Checkbox
              label="Required"
              checked={q.required}
              onChange={e => update(sId, q.id, "required", e.target.checked)}
            />
            {q.type === "long" && (
              <Input
                label="Max Length"
                type="number"
                placeholder="e.g., 500"
                value={q.maxLength || ""}
                onChange={e => update(sId, q.id, "maxLength", e.target.value)}
              />
            )}
            {q.type === "numeric" && (
              <>
                <Input
                  label="Min Value"
                  type="number"
                  value={q.min || ""}
                  onChange={e => update(sId, q.id, "min", e.target.value)}
                />
                <Input
                  label="Max Value"
                  type="number"
                  value={q.max || ""}
                  onChange={e => update(sId, q.id, "max", e.target.value)}
                />
              </>
            )}
          </div>
        </div>

        {otherQuestions.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-600 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conditional Logic</label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Show this question if...</p>
            <select
              value={q.conditionalQuestionId || ""}
              onChange={e => update(sId, q.id, "conditionalQuestionId", e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="">(Always show)</option>
              {otherQuestions.map(oq => <option key={oq.id} value={oq.id}>{oq.label.slice(0, 50)}...</option>)}
            </select>
            
            {q.conditionalQuestionId && (
              <Input
                label="...equals this value:"
                placeholder="e.g., Yes"
                value={q.conditionalValue || ""}
                onChange={e => update(sId, q.id, "conditionalValue", e.target.value)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddQuestionMenu({ onAdd }) {
  const [type, setType] = useState("short");
  return (
    <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="mt-1 block border rounded-md px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="short">Short Text</option>
        <option value="long">Long Text</option>
        <option value="single">Single Choice</option>
        <option value="multi">Multi Choice</option>
        <option value="numeric">Numeric</option>
        <option value="file">File Upload (Stub)</option>
      </select>
      <button
        onClick={() => onAdd(type)}
        className="px-4 py-2 bg-sky-600 text-white rounded-md font-medium hover:bg-sky-700"
      >
        Add Question
      </button>
    </div>
  );
}

const Input = ({ label, className = "", ...props }) => (
  <label className="block w-full">
    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
    <input
      {...props}
      className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 ${className}`}
    />
  </label>
);

const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      {...props}
      className="rounded border-gray-300 text-sky-600 shadow-sm focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600"
    />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
  </label>
);