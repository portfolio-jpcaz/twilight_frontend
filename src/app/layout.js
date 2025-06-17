import "@/styles/globals.css";
import  Providers  from './providers';

export const metadata = {
  title: 'Twilight',
  description: 'Twitter Light Application ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}