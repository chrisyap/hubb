import { Fraunces } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "WONK", "SOFT"],
  preload: true,
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});
