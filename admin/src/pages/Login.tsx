import { useForm } from "react-hook-form"
import type { LoginInfo } from "../types"
import { LoginValidation } from "../validation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAdmin, loginUser } from "../api/auth.api"
import { Navigate, useNavigate } from "react-router"

export function Login() {

  const { data } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getAdmin
  })

  const submitForm = async (data: LoginInfo) => {
    await loginMutation.mutateAsync(data);
  }
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationKey: ['admin', 'login'],
    mutationFn: loginUser,
    onSuccess: () => {
      navigate("/")
    }
  })

  const { register, handleSubmit, formState: { errors, isValid, isSubmitting, isDirty, dirtyFields } } = useForm<LoginInfo>({
    mode: "onChange", defaultValues: {
      username: '',
      password: ''
    }
  })

  if(data?.success) return <Navigate to="/" replace/>
  return (
    <div className="bg-neutral-900 min-h-screen flex justify-center items-center text-white text-xl">
      <div className="px-8 py-16 min-w-80">
        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-8">
          <h2 className="mx-auto text-4xl">Login</h2>
          <div className="relative flex flex-col gap-2">
            <label htmlFor="username" className="absolute bg-neutral-800 text-neutral-200 -translate-y-3.5 translate-x-2.5">Username</label>
            <input autoComplete="off" id="username" {...register("username", LoginValidation.username)} className={`px-3 py-2 border ${errors.username ? 'inline inline-red-500' : 'outline-none'}`} />
            {errors.username ? <p className="text-sm text-red-500">{`*${errors.username.message}`}</p> : !dirtyFields.username ? <p className="text-sm text-red-500">*Username is required</p> : null}
          </div>
          <div className="relative flex flex-col gap-2">
            <label htmlFor="password" className="absolute bg-neutral-800 text-neutral-200 -translate-y-3.5 translate-x-2.5">Password</label>
            <input autoComplete="off" id="password" {...register("password", LoginValidation.password)} className="outline-none px-3 py-2 border" />
            {errors.password ? <p className="text-sm text-red-500">{`*${errors.password.message}`}</p> : !dirtyFields.password ? <p className="text-sm text-red-500">*Password is required</p> : null}
          </div>
          <button type="submit" disabled={!isValid || isSubmitting || !isDirty} className="bg-neutral-600 disabled:opacity-60 cursor-pointer active:bg-neutral-500 p-1">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  )
}