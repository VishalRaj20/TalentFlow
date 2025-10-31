import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/ui/Spinner";
import AssessmentBuilder from "../features/assessments/AssessmentBuilder";
import AssessmentPreview from "../features/assessments/AssessmentPreview";
import { getAssessment, saveAssessment, submitAssessment } from "../features/assessments/assessmentsAPI";

export default function AssessmentEditorPage() {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(""); 

  useEffect(() => {
    async function load() {
      setLoading(true);
      setStatus("");
      try {
        const data = await getAssessment(jobId);
        setAssessment(data);
      } catch (e) {
        setAssessment({
          jobId,
          data: {
            title: "New Assessment",
            sections: [{ id: "s1", title: "Section 1", questions: [] }],
          },
        });
      }
      setLoading(false);
    }
    load();
  }, [jobId]);

  async function handleSaveBuilder() {
    setIsSaving(true);
    setStatus("");
    try {
      await saveAssessment(jobId, assessment.data);
      setStatus("✅ Builder saved!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save builder.");
    }
    setIsSaving(false);
    setTimeout(() => setStatus(""), 3000);
  }

  async function handleSubmitPreview(answers) {
    setIsSaving(true);
    setStatus("");
    try {
      await submitAssessment(jobId, answers);
      setStatus("✅ Preview submitted successfully!");
      console.log("Submitted Answers:", answers);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to submit preview.");
    }
    setIsSaving(false);
    setTimeout(() => setStatus(""), 3000);
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-semibold">Assessment Editor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Job ID: {jobId}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300 transition-opacity duration-300">
            {status}
          </span>
          <button
            onClick={handleSaveBuilder}
            disabled={isSaving}
            className="px-4 py-2 bg-sky-600 text-white rounded-md font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {isSaving ? "Saving..." : "Save Builder"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 px-1">Builder</h2>
           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <AssessmentBuilder
              assessment={assessment}
              setAssessment={setAssessment}
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 px-1">Live Preview</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <AssessmentPreview
              assessment={assessment}
              onSubmit={handleSubmitPreview}
            />
          </div>
        </div>

      </div>
    </div>
  );
}