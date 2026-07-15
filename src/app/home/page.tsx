"use client";

import { useState } from "react";
import { HomeDashboard } from "@/components/HomeDashboard";
import { readProfileOrMock } from "@/lib/profile-storage";

export default function HomePage() {
  const [profile] = useState(() => readProfileOrMock());

  return <HomeDashboard profile={profile} />;
}
