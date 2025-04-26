import React from "react";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  return (
    <div>
      <div className="flex relative flex-col min-h-screen bg-background">
        <nav className=" flex items-center justify-between p-2 px-6  w-full h-14 bg-gray-200/30 border-b ">
          <div className=" text-xl font-medium ">Expense Manager</div>
          <div>
            {user ? (
              <div className="flex items-center gap-6  text-lg">
                <Button size={"sm"} variant={"outline"}>
                  <a href="/user">{user?.username.charAt(0).toUpperCase()}</a>
                </Button>
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  onClick={() => logout()}
                  className=" text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-gray-700 hover:underline">
                  Login
                </a>
                <a href="/register" className="text-gray-700 hover:underline">
                  Register
                </a>
              </div>
            )}
          </div>
        </nav>
        <main className="flex-1 mt-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
