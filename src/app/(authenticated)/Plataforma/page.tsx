import React from "react";

type Props = {};

// Components
import Aside from "@/components/Aside";

function page({}: Props) {
  return (
    <section className="min-h-screen w-full flex justify-between">
      <Aside />
    </section>
  );
}

export default page;
