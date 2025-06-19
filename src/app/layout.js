import './globals.css'
import { Providers } from '@/utils/providers'
import { auth } from '@/utils/auth'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  title: 'Invora',
  description: 'Invoice Solution',
}

export default async function RootLayout({ children }) {
  const session = await auth()

  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Providers session={session}>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
