import { NavLink, useNavigate } from "react-router";
import type { ContentProps } from "../types";
import { Dialog } from "./Dialog";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api";

export function Sidebar({ location }: ContentProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationKey: ['admin','logout'],
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin','me']
      })
    }
  })

  const openLogoutDialog = () => {
    dialogRef.current?.showModal();
  }

  const cancelLogout = () => {
    dialogRef.current?.close();
  }

  const confirmLogout = async () => {
    dialogRef.current?.close();
    await logoutMutation.mutateAsync();
    navigate("/login",{replace:true});
  }

  return (
    <>
      <div className="hidden lg:flex lg:border lg:p-2 rounded-2xl lg:border-gray-300 lg:bg-gray-100 flex-col justify-between h-full">
        <aside className="flex flex-col h-full">
          {/* Header / Brand */}
          <div className="flex items-center gap-2 p-4">
            {/* Add your logo/icon here */}
            <span className="material-symbols-rounded">
              stylus_fountain_pen
            </span>
            <div>
              <h1 className="font-semibold text-2xl">Karma's Blog</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 mt-4">
            <ul className="space-y-1">
              <li className="flex items-center">
                <NavLink to="dashboard" className={`flex flex-1 items-center gap-3 px-4 py-2 ${location === "dashboard" ? 'bg-gray-200' : 'hover:bg-gray-200/50'} rounded-lg`}>
                  <span className="material-symbols-rounded">dashboard</span>Dashboard
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink to="posts" className={`flex flex-1 items-center gap-3 px-4 py-2 ${location === "posts" ? 'bg-gray-200' : 'hover:bg-gray-200/50'} rounded-lg`}>
                  <span className="material-symbols-rounded">
                    dynamic_feed
                  </span>Posts
                </NavLink>
              </li>
              <li>
                <NavLink to="users" className={`flex flex-1 items-center gap-3 px-4 py-2 ${location === "users" ? 'bg-gray-200' : 'hover:bg-gray-200/50'} rounded-lg`}>
                  <span className="material-symbols-rounded">
                    groups
                  </span>Users
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Footer / Logout Option */}
          <div className="pt-4 border-t border-gray-300 mt-auto">
            <button className="flex cursor-pointer justify-between items-center gap-3 w-full px-4 py-2 hover:bg-gray-200 rounded-lg" onClick={openLogoutDialog}>
              Logout<span className="material-symbols-rounded">logout</span>
            </button>
          </div>
        </aside>
      </div>
      <Dialog ref={dialogRef} cancelLogout={cancelLogout} confirmLogout={confirmLogout}/>
    </>
  )
}