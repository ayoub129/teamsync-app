import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import axios from '../axios';
import { AppContext } from '../context/AppContext';
import { setUser } from '../context/actions';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    accept: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    accept: "",
  });

  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        accept: "", 
      }));
    }, 5000);

    return () => clearTimeout(errorTimeout);
  }, [errors]);

  const handleChange = (key, e) => {
    setData({ ...data, [key]: e.target.value });
    setErrors({ ...errors, [key]: "" });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);
    const nameError = validateName(data.name);
    const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
    const acceptError = validateAccept();

    if (emailError || passwordError || nameError || confirmPasswordError || acceptError) {
      setErrors({
        email: emailError,
        password: passwordError,
        name: nameError,
        confirmPassword: confirmPasswordError,
        accept: acceptError, 
      });
      return;
    } else {
      setLoading(true);
      try {
        const response = await axios.post('/register', {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        });
    
        console.log('Response:', response.data);
        // Save token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('admin', response.data.user.isAdmin);
        
        // Set user in context
        setUser(dispatch, response.data.user);

        navigate('/');
      } catch (error) {
        setErrors({...errors , confirmPassword: error.response.data.message});
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

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Confirm password is required.";
    if (confirmPassword !== password) return "Passwords do not match.";
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Name is required.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const validateAccept = () => {
    if (!data.accept) return "Please accept the terms and conditions.";
    return "";
  };

  const accept = (e) => {
    setData({ ...data, accept: e.target.checked });
    setErrors({ ...errors, accept: "" });
  };

return (
  <div className="w-full max-w-lg mx-auto min-h-screen flex items-center justify-center overflow-x-hidden my-12">
    <div className="w-full shadow-md">
      <div className="bg-gray-200 py-5 rounded-t border">
        <h2 className="text-center mb-5 font-semibold text-3xl montserrat-font text-black">Register</h2>
        <p className="text-center text-black font-semibold">
          Already have an account? <Link className="text-blue-500 font-semibold" to="/login">Sign In</Link>
        </p>
      </div>
      <div className="rounded-b border py-16 px-4">
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <Input
              placeholder="Username"
              id="name"
              label="Username"
              text={data.name}
              handleChange={(e) => handleChange('name', e)}
            />
            {errors.name && <p className="text-red-500 mt-2">{errors.name}</p>}
          </div>
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
          <div className="mb-4">
            <Input
              placeholder="Confirm Password"
              id="confirm-password"
              label="Confirm Password"
              type="password"
              text={data.confirmPassword}
              handleChange={(e) => handleChange('confirmPassword', e)}
            />
            {errors.confirmPassword && <p className="text-red-500 mt-2">{errors.confirmPassword}</p>}
          </div>
          <div className="flex items-center mb-4">
            <Input
              text=""
              Style="flex items-center "
              id="checkbox"
              order={"order-2 ml-2"}
              type="checkbox"
              label="I accept all terms and conditions"
              handleChange={accept}
            />
          </div>
          {errors.accept && <p className="text-red-500 mt-2">{errors.accept}</p>}
          <Button handlePress={handleSignUp} color="bg-blue-400" container="w-full py-4">{loading ? 'Signing Up...' : 'Sign Up'}</Button>
        </form>
      </div>
    </div>
  </div>
);
}
  
export default SignUp;
