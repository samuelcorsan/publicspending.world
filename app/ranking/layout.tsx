import { Navbar } from "../../components/navigation/Navbar";
import { Footer } from "../../components/Footer";
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
