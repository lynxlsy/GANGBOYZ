import { Providers } from "@/components/providers"
import { Footer } from "@/components/footer"

export default function DevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  )
}