"use client";
import WeddingPage from "../page";
import { useParams } from "next/navigation";

export default function GuestPage() {
  const params = useParams();
  
  // Ensure we are catching the dynamic segment
  if (!params) return null;

  return <WeddingPage />;
}
