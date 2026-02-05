import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../shared/Input";
import { Label } from "../shared/Label";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, clearError } from "../features/auth/authSlice";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/"); // Adjust destination as needed
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-3xl font-semibold mb-8">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

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
          disabled={isSubmitting || isLoading}
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-purple-700 text-white py-4 rounded-xl font-semibold hover:bg-purple-800 transition disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
