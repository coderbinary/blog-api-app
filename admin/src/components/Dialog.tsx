import { forwardRef } from "react";
import type { DialogProps } from "../types";

export const Dialog = forwardRef<HTMLDialogElement,DialogProps>(function Dialog({cancelLogout,confirmLogout}, ref) {
  
  return (
    <dialog ref={ref} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-black/30 backdrop:backdrop-blur-sm rounded-2xl">
      <div className="w-[70dvw] max-w-xl p-4 flex flex-col">
        <p className="text-center pb-6 pt-3 mt-4 mb-2 text-xl">Are you sure you want to logout ?</p>
        <div className="flex justify-between">
          <button onClick={cancelLogout} className="cursor-pointer bg-gray-800 text-white text-xl px-2 py-1 rounded-md">Cancel</button>
          <button onClick={confirmLogout} className="cursor-pointer bg-gray-800 text-white px-2 text-xl py-1 rounded-md">Logout</button>
        </div>
      </div>
    </dialog>
  );
});