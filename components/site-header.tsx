'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ShieldCheck, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Route Safety', href: '/explore' },
  { label: 'Reviews', href: '/#reviews' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="SafeRoute home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Safe<span className="text-primary">Route</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/explore"
            className={cn(buttonVariants({ variant: 'ghost' }), 'h-9 px-4')}
          >
            Login
          </Link>
          <Link
            href="/explore"
            className={cn(buttonVariants({ variant: 'default' }), 'h-9 px-4')}
          >
            Get Started
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-9 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/explore"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'default' }), 'mt-2 h-10')}
            >
              Login
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
