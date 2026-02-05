import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Input } from "../shared/Input";
import { Label } from "../shared/Label";

type LoginFormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login Data:", data);
    // call login API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-3xl font-semibold mb-8">Login</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-100 rounded-2xl p-8 space-y-6"
        >
          {/* Email */}
          <div>
            <Label text="Email Id" tooltip="Enter your registered email address" />
            <Input
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label text="Password" tooltip="Minimum 6 characters" />
            <Input
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </form>

        <Link to="/signup" className=" flex justify-center text-center text-gray-500 my-8 cursor-pointer hover:underline">
          Create a new account
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-purple-700 text-white py-4 rounded-xl font-semibold hover:bg-purple-800 transition disabled:opacity-60"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
