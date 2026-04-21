import { redirect } from "next/navigation";

export const Home = () => {
  redirect("/editor");
};

export default Home;
