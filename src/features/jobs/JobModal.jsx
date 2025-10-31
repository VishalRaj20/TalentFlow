import React from "react";
import { Modal } from "../../components/ui/Modal";
import JobForm from "./JobForm";

export default function JobModal({ open, onClose, initial, onSave }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Job" : "New Job"}>
      <JobForm initial={initial} onSave={onSave} onCancel={onClose} />
    </Modal>
  );
}