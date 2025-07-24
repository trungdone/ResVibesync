
// app/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users when component mounts
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/user/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, toast]);

  // Handle promote to admin
  const handlePromoteToAdmin = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to promote ${userName} to admin? This will grant them full administrative privileges.`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/user/users/${userId}/promote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: "admin" } : u)));
        toast({
          title: "Success",
          description: `${userName} has been promoted to admin.`,
        });
      } else {
        throw new Error(data.detail || "Failed to promote user");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

<<<<<<< HEAD
=======
    // Handle demote artist
  const handleDemoteArtistToUser = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to demote artist ${userName} to user?`
    );
    if (!confirm) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/user/users/${userId}/demote-artist`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: "user" } : u)));
        toast({
          title: "Success",
          description: `${userName} has been demoted to user.`,
        });
      } else {
        throw new Error(data.detail || "Failed to demote artist");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to permanently delete the account of ${userName}?`
    );
    if (!confirm) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/user/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        toast({
          title: "Success",
          description: `${userName} has been deleted.`,
        });
      } else {
        throw new Error(data.detail || "Failed to delete user");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };


>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  // Handle demote to user
  const handleDemoteToUser = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to demote ${userName} to user? This will revoke their administrative privileges.`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/user/users/${userId}/demote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: "user" } : u)));
        toast({
          title: "Success",
          description: `${userName} has been demoted to user.`,
        });
      } else {
        throw new Error(data.detail || "Failed to demote user");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Handle ban user
  const handleBanUser = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to ban ${userName}? This will prevent them from accessing the system.`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/user/users/${userId}/ban`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, banned: true } : u)));
        toast({
          title: "Success",
          description: `${userName} has been banned.`,
        });
      } else {
        throw new Error(data.detail || "Failed to ban user");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Handle unban user
  const handleUnbanUser = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to unban ${userName}? This will restore their access to the system.`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/user/users/${userId}/unban`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, banned: false } : u)));
        toast({
          title: "Success",
          description: `${userName} has been unbanned.`,
        });
      } else {
        throw new Error(data.detail || "Failed to unban user");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white/10 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">Email: {user.email}</p>
              <p className="text-gray-400">Role: {user.role}</p>
              <p className="text-gray-400">Status: {user.banned ? "Banned" : "Active"}</p>
            </div>
            <div className="space-x-2">
              {user.role === "admin" ? (
                <button
                  onClick={() => handleDemoteToUser(user.id, user.name)}
                  className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                >
                  Demote to User
                </button>
              ) : (
                <button
                  onClick={() => handlePromoteToAdmin(user.id, user.name)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Promote to Admin
                </button>
              )}
<<<<<<< HEAD
=======
              {user.role === "artist" && (
                <button
                  onClick={() => handleDemoteArtistToUser(user.id, user.name)}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Demote Artist
                </button>
              )}

              <button
                onClick={() => handleDeleteUser(user.id, user.name)}
                className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
              >
                Delete
              </button>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
              {user.banned ? (
                <button
                  onClick={() => handleUnbanUser(user.id, user.name)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Unban
                </button>
              ) : (
                <button
                  onClick={() => handleBanUser(user.id, user.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ban
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
