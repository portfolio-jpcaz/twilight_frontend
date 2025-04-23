"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';
import { useEffect } from "react";
export default function EmailVerifiedPage() {
    function confettis(){
        confetti({
            particleCount:150,
            spread: 80,
            origin: { y: 0.9, x: 0.7 }
        })
    }
    const router=useRouter();
    useEffect(confettis,[]);
    return (
        <div>
        <h1 className={`txt-xlarge font-title txt-primary-color ${styles.pageTitle}`}>Welcome to the TWILIGHT application!</h1>
        <h2 className={`font-title txt-primary-color ${styles.pageSubtitle}`}>Your email has been successfully verified</h2>
        <div className={styles.redirectSection}>
            <p className="font-text txt-medium txt-secondary-color">Now you are part of the Twilight community<br/>Please sign in and enjoy... 😎 </p>
            <button className="btn btn-primary" onClick={()=>router.replace("/auth")}>Go to Login page</button>
        </div>
        </div>
    );
};