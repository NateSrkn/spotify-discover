'use client'
import { QueryClient } from "@tanstack/query-core";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}