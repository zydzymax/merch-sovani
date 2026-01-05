# Screenshot Verification Checklist

This directory is for storing screenshots to verify the UI/UX updates.

## Required Screenshots

### Homepage (/)

1. **home-hero.png** - Hero section
   - ✓ Hero (обложка).png image as background/cover
   - ✓ CTA buttons and text overlay

2. **home-howitworks.png** - How It Works section
   - ✓ Баннер «Как это работает».png banner
   - ✓ Receipt icon (Иконка «Электронный чек : подтверждение».png)
   - ✓ Price: 1,999₽

3. **home-prizes.png** - Grand Prize section
   - ✓ Большой блок «Главные призы».png image

4. **home-weekly.png** - Weekly Giveaways section
   - ✓ Сетка «Еженедельные розыгрыши — 5 недель».png grid

5. **home-countdown.png** - Countdown timer
   - ✓ Фон для блока-таймера.png as background
   - ✓ Timer functionality

6. **home-social.png** - Social media section
   - ✓ Соц-превью «Прямой эфир».png preview
   - ✓ Social media links (Telegram, YouTube, VK)

### Terms/Promo Page (/promo)

7. **terms-top.png** - Promo conditions page
   - ✓ 5 айфонов.png hero image
   - ✓ New promo mechanics: 5 weekly iPhone giveaways
   - ✓ Receipt icon and guarantee badge usage

### Catalog Page (/catalog)

8. **shop-list.png** - Product listing
   - ✓ Only keychain shows raffle participation badge
   - ✓ Other products have NO badges

9. **shop-keychain.png** - Keychain product card
   - ✓ брелок.png image
   - ✓ Price: 1,999₽
   - ✓ Badge: "🎁 1 брелок = 1 шанс на iPhone"

### Footer (all pages)

10. **footer.png** - Footer section
    - ✓ лого SoVAni.png logo (not text)
    - ✓ Legal links
    - ✓ Contact information

## Mobile Verification (375-430px width)

- [ ] Navbar doesn't overlap hero content (72px padding-top applied)
- [ ] Safe-area padding at bottom (env(safe-area-inset-bottom))
- [ ] All images load correctly
- [ ] Typography scales properly
- [ ] CTA buttons visible and clickable

## Design Consistency Checks

### Colors (Dark Theme)
- Background: #0f0f12 (--bg)
- Surface: #1a1b22 (--surface)
- Surface-2: #23242c (--surface-2)
- Text: #ffffff (--text)
- Muted: #b8bcc6 (--muted)
- Accent: #ff2b2b (--accent)

### Typography
- Headings: Unbounded font (.font-display)
- Body: Montserrat font
- Lead text: muted color with .lead class

### Components
- Tiles: .tile class with rounded corners (--radius-xxl: 36px)
- Buttons: .btn, .btn-primary, .btn-ghost
- Sections: .section with proper padding (--gap-6: 72px)
- Grid: .grid, .grid-2, .grid-3, .grid-4 responsive

### Logo
- SOVANI logo image used in Navbar and Footer (NOT text)
- Path: /images/лого SoVAni.png

## Build Verification

✓ Build completed successfully (no errors)
✓ All pages compile without warnings
✓ No `<img>` tag warnings from Next.js (only next/image used)

## Final Notes

All UI/UX updates have been implemented according to specifications:
- Unified dark theme across all pages
- Proper image integration with next/image
- Mobile-safe layout with safe-area support
- Raffle badges only on keychain products
- Consistent branding and design tokens
