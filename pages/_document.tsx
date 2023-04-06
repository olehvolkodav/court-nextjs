import { Html, Main, NextScript, Head, DocumentProps } from "next/document";
import React from "react";

const Document: React.FC<DocumentProps> = () => {
  return (
    <Html className="h-full">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600;1,700&display=swap" rel="stylesheet" />
        <link href="https://cdn.syncfusion.com/ej2/material.css" rel="stylesheet" />
      </Head>

      <body className="h-full overflow-hidden antialiased font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document;
