"use client";
import MsgModal from "@/components/ui/MsgModal";
import styles from "./page.module.css";
import { forgotPassword } from "@/services/auth";
import { useState } from "react";
// page for the user to enter his email in case of forgotten password
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setMessage(`Network Error :${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageLayout}>
      <h1 className="font-title txt-xlarge txt-primary-color">
        Password forgotten
      </h1>
      <form className={styles.formLayout} onSubmit={handleSubmit}>
      <p className="font-text txt_small txt-primary-color">Please enter your email address</p>
        <div className={styles.formGroup}>
          
          <label className="font-text txt-primary-color txt-medium" htmlFor="email" >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className= "btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Get a password reset link"}
        </button>
      </form>
      <MsgModal
        isOpen={message != null}
        setMsg={setMessage}
        title="Reset Password Request"
        message={message}
      />
    </div>
  );
}
