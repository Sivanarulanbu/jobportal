import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-6">{children}</main>
      <Footer />
    </>
  );
}
