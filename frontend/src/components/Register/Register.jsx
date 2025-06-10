import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";

const Register = () => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Disable scrolling when the page is loaded
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Disable scrolling
        return () => {
            document.body.style.overflow = "auto"; // Enable scrolling when the component unmounts
        };
    }, []);

    // Formik and Yup validation schema
    const validationSchema = Yup.object({
        first_name: Yup.string().min(2, "Too Short!").required("Required"),
        last_name: Yup.string().min(2, "Too Short!").required("Required"),
        phone_number: Yup.string()
            .matches(/^(02)?01[0125][0-9]{8}$/, "Invalid phone number")
            .required("Required"),
        gender: Yup.string().oneOf(["male", "female", "other"]).required("Required"),
        age: Yup.number().min(18, "Must be at least 18").required("Required"),
        username: Yup.string().min(4, "Too Short!").required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password_hash: Yup.string()
            .min(8, "Password too short")
            .matches(
                /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Must contain uppercase, lowercase, and number"
            )
            .required("Required"),
    });

    // Formik Setup
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            phone_number: "",
            gender: "",
            age: "",
            username: "",
            email: "",
            password_hash: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorMsg(null);
            setSuccessMsg(null);

            try {
                const response = await axios.post(
                    "http://localhost:5000/api/users",
                    values
                );

                if (response.status === 200) {
                    setSuccessMsg("Account created successfully!");
                    setTimeout(() => {
                        navigate("/login");
                    }, 200);
                }
            } catch (error) {
                setErrorMsg(error.response?.data?.message || "Registration Failed");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="relative bg-white p-10 rounded-2xl shadow-lg w-full max-w-4xl">
                <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">
                    Create an Account
                </h2>

                {successMsg && (
                    <div className="text-green-500 text-center mb-4">{successMsg}</div>
                )}
                {errorMsg && (
                    <div className="text-red-500 text-center mb-4">{errorMsg}</div>
                )}

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            {formik.errors.first_name && formik.touched.first_name && (
                                <div className="text-red-500 mb-1">
                                    {formik.errors.first_name}
                                </div>
                            )}
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="First Name"
                                name="first_name"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            {formik.errors.last_name && formik.touched.last_name && (
                                <div className="text-red-500 mb-1">
                                    {formik.errors.last_name}
                                </div>
                            )}
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Last Name"
                                name="last_name"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            {formik.errors.phone_number && formik.touched.phone_number && (
                                <div className="text-red-500 mb-1">
                                    {formik.errors.phone_number}
                                </div>
                            )}
                            <input
                                type="tel"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Phone Number"
                                name="phone_number"
                                value={formik.values.phone_number}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            {formik.errors.gender && formik.touched.gender && (
                                <div className="text-red-500 mb-1">{formik.errors.gender}</div>
                            )}
                            <select
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Age */}
                        <div>
                            {formik.errors.age && formik.touched.age && (
                                <div className="text-red-500 mb-1">{formik.errors.age}</div>
                            )}
                            <input
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Age"
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {/* Username */}
                        <div>
                            {formik.errors.username && formik.touched.username && (
                                <div className="text-red-500 mb-1">
                                    {formik.errors.username}
                                </div>
                            )}
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            {formik.errors.email && formik.touched.email && (
                                <div className="text-red-500 mb-1">{formik.errors.email}</div>
                            )}
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            {formik.errors.password_hash && formik.touched.password_hash && (
                                <div className="text-red-500 mb-1">
                                    {formik.errors.password_hash}
                                </div>
                            )}
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Password"
                                name="password_hash"
                                value={formik.values.password_hash}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105"
                        disabled={!(formik.dirty && formik.isValid) || isLoading}
                    >
                        {isLoading ? (
                            <ThreeCircles visible={true} height="30" width="30" color="red" ariaLabel="three-circles-loading" />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                {/* Have an account? Link */}
                <div className="text-center mt-4">
                    <p>
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 underline cursor-pointer"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
