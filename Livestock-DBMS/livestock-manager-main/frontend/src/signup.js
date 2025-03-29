import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { BACKEND_URL } from "./backendURL";
import axios from "axios";
import "./signup.css";

export function SignUpForm() {
  const navigate = useNavigate();
  const [eyeOpen, setEyeOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    const dataToBeSent = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: Number(data.phoneNumber),
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/signup",
        dataToBeSent,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Navigate to Animal.js upon successful signup
        navigate("/animal");
      } else {
        // Handle unsuccessful signup
        console.error("Signup failed:", response.data);
        alert(response.data.message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      alert("An error occurred: " + error.message);
    }
  }

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>Sign Up</h1>
          <p>Fill in your details and get started!</p>
        </div>
        <div>
          <div className="grid w-full items-center gap-4">
            <div className="space-y-1">
              <label htmlFor="name">Name</label>
              <input
                {...register("name", {
                  required: "This field is required",
                  minLength: {
                    value: 3,
                    message: "Name should be at least 3 characters long",
                  },
                })}
                id="name"
                placeholder="Your name"
              />
              {errors.name && (
                <div variant={"destructive"}>{errors.name.message}</div>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="framework">Email</label>
              <input
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email",
                  },
                })}
                id="email"
                placeholder="user@example.com"
              />
              {errors.email && (
                <div variant={"destructive"}>{errors.email.message}</div>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="framework">Phone Number</label>
              <input
                {...register("phoneNumber", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                id="phoneNumber"
                placeholder="1234567890"
              />
              {errors.phoneNumber && (
                <div variant={"destructive"}>{errors.phoneNumber.message}</div>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="framework">Password</label>
              <input
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Password should be at least 6 characters long",
                  },
                })}
                id="password"
                type={eyeOpen ? "text" : "password"}
                placeholder="Password"
              />
              {errors.password && (
                <div variant={"destructive"}>{errors.password.message}</div>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor="framework">Confirm Password</label>
              <input
                {...register("confirmPassword", {
                  required: "This field is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                id="confirmPassword"
                type={eyeOpen ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <div className="relative -top-8 -right-64">
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
              {errors.confirmPassword && (
                <div variant={"destructive"}>
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm">
            New here?{" "}
            <Link to="/signin" className="underline ">
              Sign In
            </Link>
          </div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
