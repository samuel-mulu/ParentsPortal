"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useChildrenIds } from "@/lib/useChildren";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Child = {
  id: string;
  full_name: string;
  photo_url: string | null;
  grade: string;
};

export default function ChildrenList() {
  const ids = useChildrenIds();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchChildren = async () => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/parents/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch children: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      setChildren(data);
    } catch (error) {
      console.error("Error fetching children:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load children. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [ids]);

  const removeChild = async (childId: string) => {
    setRemovingId(childId);

    try {
      // Update UI immediately for better UX
      setChildren((prev) => prev.filter((child) => child.id !== childId));

      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("children") || "[]");
      const updated = stored.filter((id: string) => id !== childId);
      localStorage.setItem("children", JSON.stringify(updated));

      // Show success feedback
      console.log("Child removed successfully");
    } catch (error) {
      console.error("Error removing child:", error);
      // Revert the UI change if there was an error
      fetchChildren();
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Branding */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src="/logo.jpg"
                    alt="DIGITAL KG"
                    className="h-10 w-10 rounded-xl shadow-sm"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    DIGITAL KG
                  </h1>
                  <p className="text-sm text-slate-500">Parent Portal</p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                <div className="h-10 w-32 bg-slate-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 h-16 w-16 border-4 border-blue-200 border-t-transparent rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>
              <p className="mt-6 text-slate-600 font-medium">
                Loading students...
              </p>
              <p className="mt-2 text-slate-500 text-sm">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Branding */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src="/logo.jpg"
                    alt="DIGITAL KG"
                    className="h-10 w-10 rounded-xl shadow-sm"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    DIGITAL KG
                  </h1>
                  <p className="text-sm text-slate-500">Parent Portal</p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Unable to Load Students
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>
                <button
                  onClick={fetchChildren}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Try Again
                </button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Branding */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src="/logo.jpg"
                    alt="DIGITAL KG"
                    className="h-10 w-10 rounded-xl shadow-sm"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    DIGITAL KG
                  </h1>
                  <p className="text-sm text-slate-500">Parent Portal</p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                <Link href="/parents/add-child">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                    Add Student
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-32 w-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg">
                <img
                  src="/logo.jpg"
                  alt="DIGITAL KG"
                  className="h-20 w-20 object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="text-center mt-8 max-w-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                No Students Added Yet
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Start by adding your first student to track their attendance,
                homework, results, and payments all in one place.
              </p>
              <Link href="/parents/add-child">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Add Your First Student
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="DIGITAL KG"
                  className="h-10 w-10 rounded-xl shadow-sm"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">DIGITAL KG</h1>
                <p className="text-sm text-slate-500">Parent Portal</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Student Count Badge */}
              {children.length > 0 && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {children.length}{" "}
                    {children.length === 1 ? "Student" : "Students"}
                  </span>
                </div>
              )}

              {/* Floating Add Button */}
              <Link href="/parents/add-child">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Add Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Student Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {children.map((child, index) => (
            <div
              key={child.id}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link href={`/parents/${child.id}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="h-20 w-20 relative">
                          {child.photo_url ? (
                            <Avatar className="h-20 w-20 rounded-2xl border-4 border-white shadow-lg">
                              <AvatarImage
                                src={child.photo_url}
                                alt={child.full_name}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                {child.full_name
                                  .split(" ")
                                  .map((word) => word[0]?.toUpperCase())
                                  .join("")
                                  .slice(0, 2) || "S"}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-4 border-white shadow-lg">
                              <img
                                src="/logo.jpg"
                                alt="Student"
                                className="h-14 w-14 object-cover rounded-xl"
                              />
                            </div>
                          )}
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      {/* Student Info */}
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                          {child.full_name}
                        </h3>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Grade {child.grade || "Not Assigned"}
                          </span>
                        </div>
                      </div>

                      {/* Hover Action */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-xs text-slate-500 font-medium">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Quick Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeChild(child.id);
                  }}
                  disabled={removingId === child.id}
                  className="h-8 w-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove student"
                >
                  {removingId === child.id ? (
                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
