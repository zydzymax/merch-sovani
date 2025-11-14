import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { formatPrice } from '@/lib/utils/format'
import AddToCartButton from '@/components/AddToCartButton'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { inventory: true },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const defaultVariant = product.variants[0]
  const hasDiscount = defaultVariant?.compareAt && defaultVariant.compareAt > defaultVariant.price

  // Only show raffle badge for keychain products
  const isKeychain = product.slug === 'keychain' || product.name.toLowerCase().includes('брелок')

  // Premium keychain gallery images
  const keychainGallery = isKeychain ? [
    { src: '/images/Товар — основной кадр (галерея 1).png', w: 2000, h: 2667, alt: 'Брелок-смартфон на металлической цепочке — студийный кадр' },
    { src: '/images/макро брелок.png', w: 1500, h: 1500, alt: 'Макро брелока: блок камер и звено цепочки' },
    { src: '/images/ChatGPT Image 14 нояб. 2025 г., 15_48_13.png', w: 1920, h: 1080, alt: 'Дополнительный ракурс брелока — премиальная сцена' },
  ] : []

  const displayImages = isKeychain ? keychainGallery : product.images.slice(0, 3).map((img, i) => ({
    src: img,
    w: 1000,
    h: 1333,
    alt: `${product.name} — кадр ${i + 1}`
  }))

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      {/* Product Detail */}
      <section className="section">
        <div className="container">
          {/* Breadcrumbs */}
          <div className="lead" style={{marginBottom:32,fontSize:'14px'}}>
            <Link href="/" style={{color:'var(--muted)'}}>
              Главная
            </Link>
            {' / '}
            <Link href="/catalog" style={{color:'var(--muted)'}}>
              Каталог
            </Link>
            {' / '}
            <span style={{color:'var(--text)'}}>{product.name}</span>
          </div>

          <div className="grid grid-2" style={{gap:48}}>
          {/* Images Gallery */}
          {isKeychain && displayImages.length > 0 ? (
            <div style={{display:'grid',gap:16}}>
              {/* Main image */}
              <div className="rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#14151b] shadow-[0_12px_36px_rgba(0,0,0,.28)]" style={{position:'relative'}}>
                <Image
                  src={displayImages[0].src}
                  alt={displayImages[0].alt}
                  width={displayImages[0].w}
                  height={displayImages[0].h}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                  style={{width:'100%',height:'auto'}}
                  className="select-none"
                />
                {/* Badge with icon - Only for keychain */}
                <div style={{position:'absolute',top:16,left:16,display:'flex',alignItems:'center',gap:8,background:'rgba(20,21,27,0.95)',backdropFilter:'blur(8px)',padding:'10px 16px',borderRadius:'999px',boxShadow:'0 4px 16px rgba(0,0,0,0.4)',zIndex:10}}>
                  <Image
                    src="/images/Бейдж UI.png"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                  <span style={{fontSize:'14px',fontWeight:700,color:'#fff',whiteSpace:'nowrap'}}>
                    1 брелок = 1 шанс на iPhone
                  </span>
                </div>
              </div>
              {/* Additional 2 images in grid */}
              {displayImages.length > 1 && (
                <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:16}}>
                  {displayImages.slice(1).map((img) => (
                    <div key={img.src} className="rounded-[16px] md:rounded-[20px] overflow-hidden bg-[#14151b] shadow-[0_8px_24px_rgba(0,0,0,.25)]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.w}
                        height={img.h}
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                        style={{width:'100%',height:'auto'}}
                        className="select-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Default product images (non-keychain)
            <div style={{display:'grid',gap:16}}>
              <div style={{position:'relative',aspectRatio:'3/4',borderRadius:20,overflow:'hidden',background:'var(--surface)'}}>
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    style={{objectFit:'cover'}}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',color:'var(--muted)'}}>
                    No Image
                  </div>
                )}
                {hasDiscount && (
                  <div style={{position:'absolute',right:16,top:16,borderRadius:'999px',background:'#dc2626',padding:'8px 16px',fontSize:'14px',fontWeight:700,color:'#fff'}}>
                    -{Math.round(((defaultVariant.compareAt! - defaultVariant.price) / defaultVariant.compareAt!) * 100)}%
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:16}}>
                  {product.images.slice(1, 5).map((image, idx) => (
                    <div key={idx} style={{position:'relative',aspectRatio:'1',borderRadius:14,overflow:'hidden',background:'var(--surface)'}}>
                      <Image
                        src={image}
                        alt={`${product.name} ${idx + 2}`}
                        fill
                        style={{objectFit:'cover'}}
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product Info */}
          <div>
            <h1 className="font-display" style={{fontSize:'40px',marginBottom:16}}>{product.name}</h1>

            {/* Price */}
            <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:24}}>
              <span className="font-display" style={{fontSize:'40px',color:'var(--accent)'}}>
                {formatPrice(defaultVariant.price)}
              </span>
              {hasDiscount && (
                <span className="lead" style={{fontSize:'24px',textDecoration:'line-through',color:'var(--muted)'}}>
                  {formatPrice(defaultVariant.compareAt!)}
                </span>
              )}
            </div>

            {/* Legal Notice - Only for keychain */}
            {isKeychain && (
              <div style={{marginBottom:24,padding:16,background:'var(--surface)',borderRadius:12,borderLeft:'4px solid var(--accent)'}}>
                <p className="lead" style={{fontSize:'13px',lineHeight:1.6,opacity:0.9}}>
                  <strong>Покупка брелока = 1 шанс участия в еженедельном розыгрыше.</strong>
                  {' '}Правила:{' '}
                  <Link href="/docs/rules" style={{color:'var(--accent)',textDecoration:'underline'}}>
                    /docs/rules
                  </Link>
                  <br/>
                  <span style={{opacity:0.8,fontSize:'12px'}}>
                    Продавец: Организатор акции. Оператор площадки = Агент по приёму оплаты.
                  </span>
                </p>
              </div>
            )}

            {/* Category */}
            <div style={{marginBottom:24}}>
              <span style={{display:'inline-block',background:'var(--surface-2)',padding:'8px 16px',borderRadius:'999px',fontSize:'14px',fontWeight:600,border:'1px solid var(--ring)'}}>
                {product.category === 'CLOTHING' ? 'Одежда' : 'БАДы'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div style={{marginBottom:32}}>
                <h2 className="font-display" style={{fontSize:'20px',marginBottom:12}}>Описание</h2>
                <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && typeof product.features === 'object' && (
              <div style={{marginBottom:32}}>
                <h2 className="font-display" style={{fontSize:'20px',marginBottom:12}}>Характеристики</h2>
                <dl style={{display:'grid',gap:8}}>
                  {Object.entries(product.features as Record<string, any>).map(([key, value]) => (
                    <div key={key} style={{display:'flex',gap:8}}>
                      <dt className="lead" style={{fontSize:'14px',textTransform:'capitalize'}}>{key}:</dt>
                      <dd style={{fontWeight:600,fontSize:'14px'}}>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Variants */}
            {product.variants.length > 1 && (
              <div style={{marginBottom:32}}>
                <h2 className="font-display" style={{fontSize:'20px',marginBottom:12}}>Варианты</h2>
                <div style={{display:'grid',gap:8}}>
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="tile" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:16}}>
                      <div>
                        <p style={{fontWeight:600,fontSize:'14px'}}>{variant.name || `${variant.size} ${variant.color}`.trim()}</p>
                        <p className="lead" style={{fontSize:'13px'}}>
                          В наличии: {variant.inventory?.quantity || 0} шт.
                        </p>
                      </div>
                      <p className="font-display" style={{fontSize:'18px',color:'var(--accent)'}}>
                        {formatPrice(variant.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div style={{display:'grid',gap:16}}>
              <AddToCartButton variantId={defaultVariant.id} productName={product.name} />

              <Link
                href="/catalog"
                className="btn btn-ghost"
                style={{width:'100%',textAlign:'center',padding:'18px 32px',fontSize:'16px'}}
              >
                Продолжить покупки
              </Link>
            </div>

            {/* Promo Info - Only for keychain */}
            {isKeychain && (
              <div className="tile" style={{marginTop:32,background:'rgba(255,43,43,0.1)',border:'2px solid rgba(255,43,43,0.3)',padding:24}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
                  <span style={{fontSize:'32px'}}>🎁</span>
                  <div>
                    <h3 className="font-display" style={{fontSize:'20px',marginBottom:4}}>
                      Эта покупка = 1 шанс на iPhone!
                    </h3>
                    <p className="lead" style={{fontSize:'14px',lineHeight:1.6}}>
                      Оформив заказ с этим брелоком, вы получаете <strong>1 шанс</strong> на выигрыш iPhone 17 Pro Max в еженедельном розыгрыше!
                    </p>
                  </div>
                </div>
                <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid rgba(255,43,43,0.2)'}}>
                  <p className="lead" style={{fontSize:'12px'}}>
                    💡 <strong>Розыгрыш:</strong> Каждую неделю 1 iPhone 17 Pro Max • Всего 5 призов за 5 недель акции
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
