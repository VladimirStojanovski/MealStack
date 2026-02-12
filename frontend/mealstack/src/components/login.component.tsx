// src/components/Login.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
    const [message, setMessage] = useState('');
    const [loginRequired, setLoginRequired] = useState(false);
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (location.state?.from) {
            setLoginRequired(true);
        }
    }, [location]);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const handleLogin = async (
        formValue: { username: string; password: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        const { username, password } = formValue;

        try {
            setMessage('');
            await login(username, password);
            navigate(from, { replace: true });
        } catch (error) {
            const resMessage =
                (error as any).response?.data?.message ||
                (error as any).message ||
                (error as any).toString();
            setMessage(resMessage);
            setSubmitting(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
                <div className="card shadow rounded-4 border-0">
                    <div className="card-body p-4 p-md-5">
                        <div className="text-center mb-4">
                            <img
                                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                alt="profile-img"
                                className="img-thumbnail rounded-circle mb-3"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <h3 className="fw-bold">Sign In</h3>
                            {loginRequired && (
                                <div className="alert alert-info mt-3 mb-0">
                                    Please login to access this page
                                </div>
                            )}
                        </div>

                        <Formik
                            initialValues={{ username: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}
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

                                    <div className="mb-4">
                                        <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                                            <Field
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                                className="form-control border-start-0 rounded-end-pill shadow-sm"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="password"
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
                                                    Signing In...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </button>
                                    </div>

                                    {message && (
                                        <div className="alert alert-danger mt-3 mb-0 rounded-pill">
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
    );
};

export default Login;