"use client";
import Image from "next/image";
import Modal from "react-modal";
import { useState, useEffect } from "react";
import styles from "./AuthModal.module.css";

// generic modal dialog used for signin or signup
export default function AuthModal({
  isOpen,
  setIsOpen,
  title,
  onSubmit, // function that handles the submit button
  fields = [], // the list of inputs of the form
  submitButtonText,
}) {
  //
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(formData);
    if (ok) {
      setIsOpen(false);
    }
  };

  return (
    <Modal
      contentLabel={title}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className={styles.authModal}
      overlayClassName={styles.authModalOverlay}
    >
      <Image
        src="/logo.png"
        alt="twilight logo (twitter bird upside down)"
        width={50}
        height={50}
      />
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            autoComplete={field.autoComplete || "off"}
          />
        ))}
        <button type="submit">{submitButtonText}</button>
      </form>
    </Modal>
  );
}
