import { Loader2 } from "lucide-react";
import React from "react";

interface Props {
  message?: string;
}

const Loading = ({ message = "" }: Props) => {
  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <div className="shadow-lg p-8">
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <Loader2 className="w-12 h-12 text-success animate-spin" />
          {message && (
            <p className="font-medium text-primary text-lg">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loading;
