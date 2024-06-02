import type { NextPage } from "next";
import { Content } from "@/components/home/content";
import { Providers } from "./providers";

const Home: NextPage = () => {
  return (
    <Providers>
      <Content />
    </Providers>
  );
};

export default Home;
