import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 🔹 Check if user is already logged in
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/user", {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.data.user) {
                    redirectBasedOnRole(response.data.user.role);
                }
            } catch (error) {
                console.error("User fetch error:", error);
                localStorage.removeItem("token");
            }
        };

        fetchUser();
    }, [navigate]);

    const redirectBasedOnRole = (role) => {
        switch (role) {
            case "admin":
                navigate("/admin");
                break;
            case "instructor":
                navigate("/educator");
                break;
            default:
                navigate("/");
        }
    };

    // 🔹 Function to handle login
    const handleLogin = async (values) => {
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const response = await axios.post("http://localhost:5000/api/login", values, { 
                withCredentials: true 
            });

            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setSuccessMsg("Login successful!");
                
                setTimeout(() => {
                    redirectBasedOnRole(response.data.user.role);
                }, 500);
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Formik Setup
    const formik = useFormik({
        initialValues: { email: "", password_hash: "" },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password_hash: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    "Must contain at least one uppercase letter, one lowercase letter, and one number"
                )
                .required("Password is required"),
        }),
        onSubmit: handleLogin,
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="relative bg-white bg-opacity-90 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {successMsg && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    formik.touched.email && formik.errors.email
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                } focus:outline-none focus:ring-2`}
                                placeholder="your@email.com"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password_hash" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password_hash"
                                name="password_hash"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    formik.touched.password_hash && formik.errors.password_hash
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                } focus:outline-none focus:ring-2 pr-10`}
                                placeholder="••••••••"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password_hash}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                            {formik.touched.password_hash && formik.errors.password_hash ? (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.password_hash}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!(formik.dirty && formik.isValid) || isLoading}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                !(formik.dirty && formik.isValid) || isLoading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            } transition duration-150 ease-in-out`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt className="mr-2" />
                                    Sign in
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Don't have an account?
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Link
                            to="/register"
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            <FaUserPlus className="mr-2" />
                            Create new account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;