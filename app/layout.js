import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StoreProvider from "./StoreProvider";
import StatusUpdateProvider from "@/Utils/StatusUpdateprovider";
import { OrderProvider } from "@/lib/OrderContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Urvann Tracking",
  description: "Track your orders with ease",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{ flex: 1 }}>
      <body
        style={{ flex: 1 }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StatusUpdateProvider/>
          <OrderProvider>
            <StoreProvider>
              <Navbar />
              {children}
            </StoreProvider>
          </OrderProvider>
      </body>
    </html>
  );
}
