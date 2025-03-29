import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "./backendURL";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "./signin.css";

export function SignInForm() {
  const navigate = useNavigate();
  const [eyeOpen, setEyeOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      // Send the POST request using axios
      const response = await axios.post("http://localhost:5001/signin", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response contains the expected token
      const { token } = response.data;

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Navigate to the /animal page upon successful sign-in
      navigate("/animal");
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Sign-in failed. Please check your credentials.");
    }
  }

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>Sign In</h1>
          <p>Fill in your details and continue!</p>
        </div>
        <div className="grid w-full items-center gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email">Email</label>
            <input
              {...register("email", { required: "This field is required" })}
              id="email"
              placeholder="user@example.com"
            />
            {errors.email && (
              <div variant="destructive">{errors.email.message}</div>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", { required: "This field is required" })}
              id="password"
              type={eyeOpen ? "text" : "password"}
              placeholder="Password"
            />
            {errors.password && (
              <div variant="destructive">{errors.password.message}</div>
            )}
            <div className="relative eye-icon">
              {eyeOpen ? (
                <Eye
                  className="cursor-pointer"
                  onClick={() => setEyeOpen(false)}
                />
              ) : (
                <EyeOff
                  className="cursor-pointer"
                  onClick={() => setEyeOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm">
            New here?{" "}
            <Link to="/signup" className="underline">
              Sign Up
            </Link>
          </div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
}
