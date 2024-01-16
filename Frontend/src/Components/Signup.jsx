import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/styles/signup.css"

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpButtonClicked, setOtpButtonClickd] = useState(false);
    const navigate = useNavigate();

    // SendOtpButton
    const sendOtp = async () => {
        if (email === "") {
            return toast.warning("Please Enter Your Email First", {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
        setOtpButtonClickd(true);

        const url = "http://localhost:3000/user/sent-otp";
        const data = { email: email };
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }

        try {
            const response = await fetch(url, requestOptions);

            const responseData = await response.json();
            if (responseData.error) {
                toast.error(`${responseData.error}`, {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });

                return setOtpButtonClickd(false);
            }

            toast.success(`${responseData.message}`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return setOtpButtonClickd(false);

        } catch (error) {
            toast.error(`${error.message}`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            setOtpButtonClickd(false);
        }
    }

    // Signup Submit Button
    const signupSubmitBtn = async (e) => {
        e.preventDefault();
        if (name === "" || otp === "" || password === "") {
            return toast.warning("Please Fill All the fields!", {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }

        const url = "http://localhost:3000/user/signup";
        const data = {
            name: name,
            email: email,
            userOtp: otp,
            password: password
        }
        // requestObject
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }

        try {
            // Sending signup fetch request
            const response = await fetch(url, requestOptions);
            const responseData = await response.json();
            if (responseData.error) {
                return toast.error(`${responseData.error}`, {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }

            // If no error
            toast.success(`${responseData.message}`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            // Saving token to localstorage
            if (responseData.token) {
                localStorage.setItem("token", responseData.token);
            }
            navigate("/chat");

        } catch (error) {
            toast.error(`${error.message}`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }

    return (
        <div className="signup">
            {/* Form */}
            <form className="signup-form">
                <h1 className="signup-form-heading">Get Started</h1>
                {/* Name */}
                <label htmlFor="name">Your Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Enter Your Name -" required />

                {/* Email */}
                <label htmlFor="email">Your Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter Your Email -" required />

                {/* Otp */}
                <div className="email_otp">
                    <input type="tel" value={otp} onChange={(e) => setOtp(e.target.value)} id="otp" placeholder="Enter Valid OTP -" required />
                    <button type="button" className={`sendOtpBtn ${otpButtonClicked ? "disabled" : ""}`} onClick={sendOtp}>Send</button>
                </div>

                {/* Password */}
                <label htmlFor="password">Your Password:</label>
                <input type="tel" value={password} minLength={6} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter Your Password -" required />

                {/* Button */}
                <button type="submit" className="submitBtn" onClick={signupSubmitBtn}>Sign up</button>

                {/* Other */}
                <div className="other">
                    <p>Already have an account?</p>
                    <Link to="/login">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;