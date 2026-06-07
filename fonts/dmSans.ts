import { DM_Sans } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  preload: true,
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
});
