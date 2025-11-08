'use client'

import { useState } from 'react'
import Link from 'next/link'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-50 p-2"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-brand-dark transition-transform ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-brand-dark transition-opacity ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-brand-dark transition-transform ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-brand-cream z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="pt-20 px-6">
          <div className="space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-lg font-semibold text-brand-dark hover:bg-brand-gold/20 rounded-lg transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-lg font-semibold text-brand-dark hover:bg-brand-gold/20 rounded-lg transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/promo"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-lg font-semibold text-brand-dark hover:bg-brand-gold/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🎄</span>
              <span>Акция</span>
            </Link>
            <Link
              href="/draws"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-lg font-semibold text-brand-dark hover:bg-brand-gold/20 rounded-lg transition-colors"
            >
              Розыгрыши
            </Link>
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 mt-6 bg-brand-gold text-brand-dark font-bold rounded-full text-center hover:bg-brand-gold/90 transition-colors"
            >
              Войти
            </Link>
          </div>

          {/* Footer links in mobile menu */}
          <div className="mt-12 pt-6 border-t border-brand-gold/20">
            <p className="text-sm text-brand-dark/60 mb-3">Документы:</p>
            <div className="space-y-2">
              <Link
                href="/legal/privacy"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-brand-dark/70 hover:text-brand-red"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/legal/offer"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-brand-dark/70 hover:text-brand-red"
              >
                Публичная оферта
              </Link>
              <Link
                href="/legal/promo-rules"
                onClick={() => setIsOpen(false)}
                className="block text-sm text-brand-dark/70 hover:text-brand-red"
              >
                Правила розыгрыша
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
