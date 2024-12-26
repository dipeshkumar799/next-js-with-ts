import { useAuthStore } from '@/store/Auth'; // Import Zustand store
import React from 'react';

export default function RegisterPage() {
  const { createAccount } = useAuthStore(); // Zustand store method for account creation
  const [loading, setLoading] = React.useState(false); // State for loading indicator
  const [error, setError] = React.useState(""); // State for error messages

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    // Check for empty fields
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill all the fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the store method to create an account
      await createAccount(firstName as string, email as string, password as string);
      alert("Account created successfully!");
    } catch (err) {
      setError("Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {/* Display loading or error messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Registration form */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" />
        <input type="text" name="lastName" placeholder="Last Name" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit" disabled={loading}>Register</button>
      </form>
    </div>
  );
}
