import React, { useState } from "react";

export default function AssessmentPreview({ assessment, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  if (!assessment) return <div>No preview</div>;

  function setAnswer(questionId, value) {
    setAnswers(current => ({ ...current, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(current => ({ ...current, [questionId]: null }));
    }
  }

  function isVisible(question) {
    if (!question.conditionalQuestionId) return true;
    const controllingAnswer = answers[question.conditionalQuestionId];
    if (controllingAnswer === undefined) return false;
    if (Array.isArray(controllingAnswer)) {
      return controllingAnswer.includes(question.conditionalValue);
    }
    return controllingAnswer === question.conditionalValue;
  }

  function validate() {
    const newErrors = {};
    for (const section of assessment.data.sections) {
      for (const q of section.questions) {
        if (!isVisible(q)) continue;
        const val = answers[q.id];

        if (q.required && (val === undefined || val === "" || (Array.isArray(val) && val.length === 0))) {
          newErrors[q.id] = "This field is required.";
          continue;
        }
        if (q.type === "long" && q.maxLength && val && val.length > q.maxLength) {
          newErrors[q.id] = `Must be ${q.maxLength} characters or less.`;
        }
        if (q.type === "numeric") {
          const num = parseFloat(val);
          if (q.min !== undefined && num < q.min) {
            newErrors[q.id] = `Must be ${q.min} or greater.`;
          }
          if (q.max !== undefined && num > q.max) {
            newErrors[q.id] = `Must be ${q.max} or less.`;
          }
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onSubmit(answers);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="font-semibold text-2xl text-gray-800 dark:text-gray-100">{assessment.data.title}</h3>
      {assessment.data.sections.map(s => (
        <div key={s.id} className="space-y-6">
          <h4 className="font-medium text-xl pb-2 border-b border-gray-200 dark:border-gray-700">{s.title}</h4>
          
          {(s.questions || []).map(q =>
            isVisible(q) && (
              <QuestionRuntime
                key={q.id}
                q={q}
                value={answers[q.id]}
                error={errors[q.id]}
                onChange={setAnswer}
              />
            )
          )}
        </div>
      ))}
      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Submit Assessment
      </button>
    </form>
  );
}

function QuestionRuntime({ q, value, error, onChange }) {
  const label = (
    <label className="block text-md font-medium text-gray-800 dark:text-gray-200">
      {q.label}
      {q.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <div className={`p-4 rounded-lg border ${error ? "bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700" : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"}`}>
      {q.type !== "multi" && label}
      
      <div className="mt-2">
        {q.type === "short" && (
          <input
            type="text"
            value={value || ""}
            onChange={e => onChange(q.id, e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2 shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600"
          />
        )}

        {q.type === "long" && (
          <textarea
            rows={4}
            value={value || ""}
            onChange={e => onChange(q.id, e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2 shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600"
          />
        )}

        {q.type === "numeric" && (
          <input
            type="number"
            value={value || ""}
            onChange={e => onChange(q.id, e.target.value)}
            className="mt-1 block w-full border rounded-md px-3 py-2 shadow-sm border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600"
          />
        )}

        {q.type === "file" && (
          <div className="mt-2 p-6 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            File Upload (Stub)
            <p className="text-sm">This is a placeholder for a file input.</p>
          </div>
        )}

        {q.type === "single" && (
          <div className="mt-2 space-y-2">
            {(q.options || []).map(opt => (
              <label key={opt.id} className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name={q.id}
                  value={opt.label}
                  checked={value === opt.label}
                  onChange={e => onChange(q.id, e.target.value)}
                  className="rounded-full text-sky-600 focus:ring-sky-500 dark:bg-gray-600 dark:border-gray-500"
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === "multi" && (
          <fieldset className="mt-2 space-y-2">
            <legend className="block text-md font-medium text-gray-800 dark:text-gray-200">
              {q.label}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </legend>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select all that apply.</p>

            <div className="mt-2 space-y-2">
              {(q.options || []).map(opt => (
                <label key={opt.id} className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    value={opt.label}
                    checked={(value || []).includes(opt.label)}
                    onChange={e => {
                      const current = value || [];
                      const newValue = e.target.checked
                        ? [...current, opt.label]
                        : current.filter(v => v !== opt.label);
                      onChange(q.id, newValue);
                    }}
                    className="rounded text-sky-600 focus:ring-sky-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}