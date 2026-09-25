import React from 'react';
import './globals.css';

export const metadata = {
  title: 'GOALIX - Sports Betting & AI Predictions',
  description:
    'GOALIX est une plateforme de paris sportifs avec matchs, cotes et prédictions assistées par IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
