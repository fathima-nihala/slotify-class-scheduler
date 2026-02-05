import React, { useEffect } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "../shared/Label";
import { Input } from "../shared/Input";
import { Error } from "../shared/Error";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signup, clearError } from "../features/auth/authSlice";

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  countryCode: yup.string().required(),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
    .required("Contact number is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
  // Note: the backend handles creating "name" from firstName and lastName
});

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { countryCode: "+91" },
  });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await dispatch(signup(data)).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="min-h-screen bg-white px-8 py-10">
        <h1 className="text-3xl font-semibold mb-8">Sign Up</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center max-w-4xl mx-auto" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-100 rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <div>
            <Label text="First Name" tooltip="Enter your given name" />
            <Input {...register("firstName")} />
            <Error text={errors.firstName?.message} />
          </div>

          {/* Last Name */}
          <div>
            <Label text="Last Name" tooltip="Enter your family name" />
            <Input {...register("lastName")} />
            <Error text={errors.lastName?.message} />
          </div>

          {/* Email */}
          <div>
            <Label text="Email Id" tooltip="We’ll send verification here" />
            <Input type="email" {...register("email")} />
            <Error text={errors.email?.message} />
          </div>

          {/* Contact Number */}
          <div>
            <Label text="Contact Number" tooltip="WhatsApp preferred" />

            <div className="flex gap-3">
              <select
                {...register("countryCode")}
                className="w-24 rounded-xl px-3 py-3 bg-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>

              <Input
                type="tel"
                {...register("phone")}
                className="flex-1"
              />
            </div>

            <Error text={errors.phone?.message} />
          </div>

          {/* Password */}
          <div>
            <Label text="Password" tooltip="Minimum 6 characters" />
            <Input type="password" {...register("password")} />
            <Error text={errors.password?.message} />
          </div>

          {/* Confirm Password */}
          <div>
            <Label text="Confirm Password" tooltip="Must match password" />
            <Input type="password" {...register("confirmPassword")} />
            <Error text={errors.confirmPassword?.message} />
          </div>
        </form>

        <div className="text-center text-gray-500 my-8">
          Already have an Account?{" "}
          <Link to="/login" className="text-black font-medium cursor-pointer">
            Login
          </Link>
        </div>

        <button
          disabled={isSubmitting || isLoading}
          onClick={handleSubmit(onSubmit)}
          className="block cursor-pointer mx-auto bg-purple-700 text-white px-24 py-4 rounded-xl font-semibold hover:bg-purple-800 transition disabled:opacity-60"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </div>
    </Tooltip.Provider>
  );
};

export default Signup;
