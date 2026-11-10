import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { MainContent } from "./components/MainContent";
import { getAdmin } from "./api/auth.api";

export function App() {

  const { location } = useParams();
  const { data, error, isPending } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getAdmin,
    staleTime: 1000 * 60 * 5
  })

  if (isPending) {
    return <div>Loading...</div>
  }
  if (error || !data?.success) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 grid lg:grid-cols-[20rem_1fr] p-2 lg:gap-2">
      <Sidebar location={location ? location : "dashboard"} />
      <MainContent location={location ? location : "dashboard"} />
    </div>
  )
}