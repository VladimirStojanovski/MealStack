// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // You can log errors to an error reporting service here
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 text-center">
                            <div className="card shadow-sm border-danger">
                                <div className="card-body p-5">
                                    <h1 className="text-danger mb-4">Something went wrong</h1>
                                    <p className="lead">
                                        We're sorry for the inconvenience. Please try refreshing the page.
                                    </p>
                                    <p className="text-muted mb-4">
                                        {this.state.error?.toString()}
                                    </p>
                                    <Link to="/" className="btn btn-primary">
                                        Return Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;