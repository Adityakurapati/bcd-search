import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import "./globals.css";



/* ================= FONTS ================= */

const geistSans = Geist({

  variable: "--font-geist-sans",

  subsets: ["latin"],

});


const geistMono = Geist_Mono({

  variable: "--font-geist-mono",

  subsets: ["latin"],

});



/* ================= METADATA ================= */

export const metadata: Metadata = {

  metadataBase: new URL("https://your-domain.com"), // CHANGE THIS


  title: {

    default: "Vaibhav Jain | BCD Election 2026",

    template: "%s | BCD Election 2026",

  },


  description:

    "Official voter search portal for Bar Council of Delhi Election 2026. Search your voter entry and download your voter slip. Support Vaibhav Jain (Ballot No. 136).",



  keywords: [

    "Bar Council Election",

    "BCD Election 2026",

    "Vaibhav Jain",

    "Voter Search",

    "Voter Slip",

  ],



  authors: [

    {

      name: "Election Campaign Team",

    },

  ],



  creator: "Vaibhav Jain",



  applicationName: "BCD Election Portal",



  openGraph: {

    title: "Vaibhav Jain | BCD Election 2026",

    description:

      "Search your voter entry and support Vaibhav Jain (Ballot No. 136) in Bar Council of Delhi Election 2026.",

    url: "https://your-domain.com",

    siteName: "BCD Election 2026",

    locale: "en_IN",

    type: "website",

    images: [

      {

        url: "/share.png",

        width: 1200,

        height: 630,

        alt: "Vaibhav Jain Election Campaign",

      },

    ],

  },



  twitter: {

    card: "summary_large_image",

    title: "Vaibhav Jain | BCD Election 2026",

    description:

      "Official voter search portal. Support Vaibhav Jain (Ballot No. 136).",

    images: ["/share.png"],

  },



  icons: {

    icon: [

      { url: "/favicon.ico" },

      { url: "/icon.svg", type: "image/svg+xml" },

    ],

    apple: "/apple-icon.png",

  },



  themeColor: "#0b3d91",



  viewport:

    "width=device-width, initial-scale=1, maximum-scale=1",



  robots: {

    index: true,

    follow: true,

  },

};




/* ================= ROOT LAYOUT ================= */

export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (

    <html lang="en">

      <body

        className={`

          ${geistSans.variable}

          ${geistMono.variable}

          font-sans

          bg-gray-100

          antialiased

        `}

      >

        {children}

        <Analytics />

      </body>

    </html>

  );

}
