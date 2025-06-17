"use client";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import { LOGO_PATH } from "@/app/constants";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MsgModal from "@/components/ui/MsgModal";
import { signup , signin } from "@/services/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/reducers/userSlice";
export default function AuthPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [msg, setMsg]=useState(null);
  const router = useRouter();
  const dispatch=useDispatch();
  const handleLogin = async (data) => {
    
    console.log(`User login: ${data.username} - password: ${data.password}`);
    const userData = await signin(data);
    if (userData.result){
      // successful login : save the user data into the user reducer
      dispatch(setCredentials(userData))
      // navigate to dashboard
      router.push("/");
    } else {
      
      setMsg(userData.message)
    }
    setIsLoginOpen(false);
    return userData.result;

  };
  const handleSignUp = async (data) => {
    //console.log(`New User : ${data.username} - first name : ${data.firstname} - password: ${data.password}`);
    
    const res = await signup(data);
    setMsg(res.message);
    setIsSignupOpen(false);

    return res.result;
  };
  return (
    <div className={styles.loginPageContent}>
      <Image
        src={LOGO_PATH}
        alt="Twilight application logo"
        width={50}
        height={50}
      />
      <h1 className="font-title txt-xlarge txt-primary-color">See what&rsquo;s happening</h1>
      <p className="font-title txt-large txt-primary-color">Join Twilight today.</p>
      <button className="btn btn-primary" onClick={() => setIsSignupOpen(true)}>Sign up</button>
      <p className="font-title txt-small txt-primary-color">Already have an account?</p>
      <button className="btn btn-dark" onClick={() => setIsLoginOpen(true)}>
        Sign in
      </button>
      <MsgModal 
      isOpen={msg!=null}
      setMsg={setMsg}
      title="Authentication"
      message={msg}
      />
      <AuthModal 
        isOpen={isLoginOpen}
        setIsOpen={setIsLoginOpen}
        title="Log in"
        fields={[
          {
            name: "username",
            type: "text",
            placeholder: "Username",
            required: true,
          },
          {
            name: "password",
            type: "password",
            placeholder: "Password",
            required: true,
            autoComplete: "new-password",
          },
          {
            name:`/auth/forgot-password`,
            type:"link",
            placeholder:"Forgot password ?"
          }
        ]}
        submitButtonText="Sign In"
        onSubmit={handleLogin}
      />
      <AuthModal
        isOpen={isSignupOpen}
        setIsOpen={setIsSignupOpen}
        title="Create a Twilight account"
        fields={[
          {
            name: "username",
            type: "text",
            placeholder: "Username",
            required: true,
          },
          {
            name: "firstname",
            type: "text",
            placeholder: "First Name",
            required: true,
          },
          {
            name: "email",
            type: "email",
            placeholder: "Email",
            autoComplete:"email",
            required: true,
          },
          {
            name: "password",
            type: "password",
            placeholder: "Password",
            required: true,
            autoComplete: "new-password",
          },
        ]}
        submitButtonText="Sign Up"
        onSubmit={handleSignUp}
      />
    </div>
  );
}
