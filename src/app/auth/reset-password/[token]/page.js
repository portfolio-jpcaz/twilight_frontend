"use client";
import { useState } from "react";
import styles from "./page.module.css";
import MsgModal from "@/components/ui/MsgModal";
import {useRouter, useParams } from "next/navigation";
import { newPassword } from "@/services/auth";

export default function ResetPasswordPage(paramsPromise) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const {token} = useParams();   // ← récupère ?token=
  const router=useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      return setMsg("The passwords do not match, please try again");
    }
    const res = await newPassword(token, password);
    setMsg(res.message);
    if (res.result) {
      router.replace("/auth");
    }
  };
  return (
    <div className={styles.pageLayout}>
      <h1 className="font-title txt-xlarge txt-primary-color">
        Create a New Password
      </h1>
      <p className="font-text txt-primary-color text-medium">Please reset your password for your Twilight account</p>
      <form className={styles.formLayout} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label
            className="font-text txt-primary-color txt-medium"
            htmlFor="passwd"
          >
            Enter your password
          </label>
          <input
            id="passwd"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className={styles.formGroup}>
          
          <label
            className="font-text txt-primary-color txt-medium"
            htmlFor="confpasswd"
          >
            Confirm your password
          </label>
          <input
            id="confpasswd"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </div>
        <button className= "btn btn-primary" type="submit">Reinitialize Password</button>
      </form>
      <MsgModal
        isOpen={msg != null}
        setMsg={setMsg}
        title="Password Change Confirmation"
        message={msg}
      />
    </div>
  );
}
