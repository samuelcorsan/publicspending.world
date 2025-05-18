import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";
export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
