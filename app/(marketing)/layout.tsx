import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="relative overflow-x-hidden">
        {children}
        <Footer />
      </div>
    </>
  );
}
