"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import MsgModal from "@/components/ui/MsgModal";
import router from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [msg, setMsg] = useState(null);
  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const token = searchParams.get("token");
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if ( password != confirmPassword ) {
        return setMsg("The passwords do not match, please try again")
    }
    const res = await newPassword(token, password);
    setMsg(res.message);
    if ( res.result ){
        router.replace('/auth')
    }
  }
  return (
    <div>
      <h1>
        Hi {firstname}, please reset your password for your Twilight account
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <button type="submit">Reinitialize Password</button>
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
