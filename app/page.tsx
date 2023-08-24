import Board from "@/components/Board";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";

export default function Home() {
  return (
    <main className="">
      <Header />
      <Board />
    </main>
  );
}
