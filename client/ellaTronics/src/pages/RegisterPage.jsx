import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    telegram: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!form.name || !form.email || !form.phone || !form.password || !form.telegram) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    } else if (!emailRegex.test(form.email)) {
      setMessage("Invalid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/users/register", form);

      if (res.data.success) {
        localStorage.setItem("userId", res.data.userId);
        navigate("/verify-otp")
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server is not responding. try again!");
      }
    }
  };

  return (
    <div className="pt-10 pb-10 w-full">
      <div className="w-full flex flex-col items-center justify-center">

        <form 
          onSubmit={handleSubmit}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">Create Account</h2>
          <p className="text-sm text-gray-500/90 mt-3 mb-4">
            Join us by creating your account
          </p>


          {/* Error Message */}
          {message && (
            <div className="w-full bg-red-100 text-red-700 p-2 rounded text-sm mb-3 text-center">
              {message}
            </div>
          )}

          {/* FULL NAME */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-5 gap-2 mb-4">
            <svg width="16" height="16" fill="#6B7280" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Full name"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280" />
            </svg>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email address"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
            />
          </div>

          {/* PHONE */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7280">
              <path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.8-.4 1.2-.3 1 .3 2 .5 3.1.5.7 0 1.3.6 1.3 1.3v3c0 .7-.6 1.3-1.3 1.3C9.7 20.3 3.7 14.3 3.7 6.3 3.7 5.6 4.3 5 5 5h3c.7 0 1.3.6 1.3 1.3 0 1.1.2 2.1.5 3.1.1.4 0 .9-.4 1.2l-1.8 2.2z"/>
            </svg>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              placeholder="Phone number"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
            />
          </div>

          {/* TELEGRAM */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <svg width="16" height="14" fill="#6B7280" viewBox="0 0 24 24">
              <path d="M9.999 14.999l-.999 4.001c.431 0 .617-.185.843-.409l2.016-1.983 4.18 3.057c.767.423 1.314.201 1.513-.709l2.743-12.84c.25-1.161-.42-1.613-1.162-1.33L2.33 9.547c-1.142.446-1.125 1.072-.207 1.363l4.937 1.54 11.462-7.218c.54-.353 1.034-.158.628.194"/>
            </svg>
            <input
              type="text"
              name="telegram"
              onChange={handleChange}
              placeholder="Telegram username"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-6">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="#6B7280">
              <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"/>
            </svg>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
