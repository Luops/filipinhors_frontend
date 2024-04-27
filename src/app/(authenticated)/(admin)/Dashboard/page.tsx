"use client";
import React from "react";

type Props = {};

// Components
import AsideDashboard from "@/components/AsideDashboard";

function page({}: Props) {
  return (
    <section className="min-h-screen w-full flex justify-between">
      <AsideDashboard />
    </section>
  );
}

export default page;
