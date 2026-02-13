import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import UserService from "../services/user.service";
import type { IUser } from "../types/user.type";

interface EditUserModalProps {
    user: IUser | null;
    show: boolean;
    handleClose: () => void;
    onUserUpdated: (updatedUser: IUser) => void;
}

const EditUserModal = ({ user, show, handleClose, onUserUpdated }: EditUserModalProps) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username ?? "");
            setEmail(user.email ?? "");
        }
    }, [user, show]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const updatedUser = await UserService.editUser(user.id, { username, email });
            onUserUpdated(updatedUser.data);
            handleClose();
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUserModal;
