import { Dashboard } from "./Dashboard"
import { Posts } from "./Posts"
import { Users } from "./Users"
import type { ContentProps } from "../types"
import { Navigate } from "react-router"



export function MainContent(props: ContentProps) {
  if (props.location === 'posts') return <Posts />
  if (props.location === 'users') return <Users />
  if (props.location === 'dashboard') return <Dashboard />

  return <Navigate to="/dashboard" replace/>
  }