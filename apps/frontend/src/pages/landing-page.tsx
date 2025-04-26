"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { LogOut, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-gray-900">MyApp</div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                    asChild
                  >
                    <a href="/home">Home</a>
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold">
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logout()}
                    className="text-gray-600 hover:text-gray-900"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                    asChild
                  >
                    <a href="/login">Login</a>
                  </Button>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <a href="/register">Register</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Manage Your Expenses with Ease
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600">
            Track, categorize, and visualize your spending in a simple,
            intuitive app.
          </p>
          <div className="mt-8 flex justify-center">
            {user ? (
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium"
              >
                <a href="/home">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            ) : (
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium"
              >
                <a href="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
