import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import axios from '../axios';

const SignIn = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setData(prevData => ({ ...prevData, email: storedEmail }));
    }
  }, []);

  const handleChange = (key, e) => {
    setData({ ...data, [key]: e.target.value });
    setErrors({ ...errors, [key]: "" });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      setLoading(false);
      return;
    } else {
      try {
        const response = await axios.post('/login', {
          email: data.email,
          password: data.password
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('admin', response.data.user.is_admin);
        localStorage.setItem('user_id', response.data.user.id);

        if (data.remember) {
          localStorage.setItem('rememberedEmail', data.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        navigate('/');
      } catch (error) {
        setErrors({ ...errors, password: error.response.data.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email address.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const rememberUser = (e) => {
    setData({ ...data, remember: e.target.checked });
  };

  return (
    <div className="w-screen mx-auto min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md shadow-md">
        <div className="bg-gray-200 py-5 rounded-t border">
          <h2 className="text-center mb-5 font-semibold text-3xl montserrat-font text-black">Log In</h2>
          <p className="text-center text-black font-semibold">
            Don't have an account? <Link className="text-blue-500 font-semibold" to="/register">Sign Up</Link>
          </p>
        </div>
        <div className="rounded-b border py-8 px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <Input
                placeholder="Email"
                id="email"
                label="Email"
                text={data.email}
                handleChange={(e) => handleChange('email', e)}
              />
              {errors.email && <p className="text-red-500 mt-2">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <Input
                placeholder="Password"
                id="password"
                label="Password"
                type="password"
                text={data.password}
                handleChange={(e) => handleChange('password', e)}
              />
              {errors.password && <p className="text-red-500 mt-2">{errors.password}</p>}
            </div>
            <div className="flex items-center mb-4">
              <Input
                text=""
                Style="flex items-center"
                id="checkbox"
                order="order-2 ml-2"
                type="checkbox"
                label="Remember me"
                handleChange={rememberUser}
              />
            </div>
            <Button handlePress={handleSignIn} color="bg-blue-400" container="w-full py-3">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
