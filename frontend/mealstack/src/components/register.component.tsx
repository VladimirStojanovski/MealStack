// src/components/Register.tsx
import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must not exceed 20 characters')
            .required('Username is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters')
            .matches(
                /^(?=.*[A-Z])(?=.*\d).+$/,
                'Password must contain at least one uppercase letter and one number'
            )
            .required('Password is required'),
        repeatedPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
            .required('Please confirm your password')
    });

    const handleRegister = async (
        formValue: { username: string; email: string; password: string; repeatedPassword: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        const { username, email, password, repeatedPassword } = formValue;

        try {
            setMessage('');
            setSuccessful(false);
            await register(username, email, password, repeatedPassword);
            setSuccessful(true);
            setMessage('Registration successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            const resMessage =
                (error as any).response?.data?.message ||
                (error as any).message ||
                (error as any).toString();
            setSuccessful(false);
            setMessage(resMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto mb-5">
                    <div className="card shadow rounded-4 border-0">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <img
                                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                    alt="profile-img"
                                    className="img-thumbnail rounded-circle mb-3"
                                    style={{ width: '100px', height: '100px' }}
                                />
                                <h3 className="fw-bold">Create Account</h3>
                            </div>

                            <Formik
                                initialValues={{ username: '', email: '', password: '', repeatedPassword: '' }}
                                validationSchema={validationSchema}
                                onSubmit={handleRegister}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="mb-3">
                                            <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                          <i className="bi bi-person-fill"></i>
                        </span>
                                                <Field
                                                    name="username"
                                                    type="text"
                                                    placeholder="Username"
                                                    className="form-control border-start-0 rounded-end-pill shadow-sm"
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                          <i className="bi bi-envelope-fill"></i>
                        </span>
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    className="form-control border-start-0 rounded-end-pill shadow-sm"
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                                                <Field
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Password"
                                                    className="form-control border-start-0 rounded-0 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary border-start-0 rounded-end-pill"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex={-1}
                                                >
                                                    <i
                                                        className={`bi ${
                                                            showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'
                                                        }`}
                                                    ></i>
                                                </button>
                                            </div>
                                            <div className="form-text ms-1">
                                                At least 6 characters with 1 uppercase and 1 number
                                            </div>
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                                                <Field
                                                    name="repeatedPassword"
                                                    type={showPassword ? 'text' : 'repeatedPassword'}
                                                    placeholder="Repeated Password"
                                                    className="form-control border-start-0 rounded-0 shadow-sm"
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="repeatedPassword"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg rounded-pill"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Registering...
                                                    </>
                                                ) : (
                                                    'Register'
                                                )}
                                            </button>
                                        </div>

                                        {message && (
                                            <div
                                                className={`alert mt-3 mb-0 rounded-pill ${
                                                    successful ? 'alert-success' : 'alert-danger'
                                                }`}
                                            >
                                                {message}
                                            </div>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;