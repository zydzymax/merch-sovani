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
    where: { slug: params.slug },
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

  // Редирект на Ozon для товаров не в наличии
  const features = product.features as { ozonLink?: string; outOfStock?: boolean } | null
  if (features?.outOfStock && features?.ozonLink) {
    return (
      <div className="min-h-screen" style={{background:"var(--bg)",color:"var(--text)"}}>
        <Navbar />
        <section className="section" style={{textAlign:"center",paddingTop:100}}>
          <div className="container" style={{maxWidth:600}}>
            <h1 style={{fontSize:32,marginBottom:24}}>{product.name}</h1>
            <div style={{background:"#fef3c7",border:"1px solid #f59e0b",borderRadius:12,padding:24,marginBottom:32}}>
              <p style={{fontSize:18,marginBottom:16}}>⚠️ Товар временно закончился на нашем сайте</p>
              <p style={{color:"var(--muted)"}}>Вы можете заказать этот товар на Ozon</p>
            </div>
            <a href={features.ozonLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:"#005bff",color:"white",padding:"16px 32px",borderRadius:8,fontSize:18,fontWeight:600,textDecoration:"none"}}>
              Заказать на Ozon →
            </a>
          </div>
        </section>
        <BigFooter />
      </div>
    )
  }

  const defaultVariant = product.variants[0]
  const hasDiscount = defaultVariant?.compareAt && defaultVariant.compareAt > defaultVariant.price

  // Check if keychain product
  const isKeychain = product.slug === 'keychain' || product.name.toLowerCase().includes('брелок')

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
          {/* Product Image - одно фото */}
          <div style={{display:'grid',gap:16}}>
            <div className="rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#14151b] shadow-[0_12px_36px_rgba(0,0,0,.28)]" style={{position:'relative'}}>
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={1000}
                  height={1333}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                  style={{width:'100%',height:'auto'}}
                  className="select-none"
                />
              ) : (
                <div style={{display:'flex',height:400,alignItems:'center',justifyContent:'center',color:'var(--muted)'}}>
                  No Image
                </div>
              )}
              {isKeychain && (
                <div style={{position:'absolute',top:16,left:16,display:'flex',alignItems:'center',gap:8,background:'rgba(20,21,27,0.95)',backdropFilter:'blur(8px)',padding:'10px 16px',borderRadius:'999px',boxShadow:'0 4px 16px rgba(0,0,0,0.4)',zIndex:10}}>
                  <span style={{fontSize:'14px',fontWeight:700,color:'#fff',whiteSpace:'nowrap'}}>
                    Премиум качество
                  </span>
                </div>
              )}
              {hasDiscount && (
                <div style={{position:'absolute',right:16,top:16,borderRadius:'999px',background:'#dc2626',padding:'8px 16px',fontSize:'14px',fontWeight:700,color:'#fff'}}>
                  -{Math.round(((defaultVariant.compareAt! - defaultVariant.price) / defaultVariant.compareAt!) * 100)}%
                </div>
              )}
            </div>
          </div>

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

            {/* Delivery info - Only for keychain */}
            {isKeychain && (
              <div style={{marginBottom:24,padding:16,background:'var(--surface)',borderRadius:12,borderLeft:'4px solid var(--accent)'}}>
                <p className="lead" style={{fontSize:'13px',lineHeight:1.6,opacity:0.9}}>
                  <strong>Доставка СДЭК по всей России.</strong> Срок: 2-7 дней.
                </p>
              </div>
            )}

            {/* Category */}
            <div style={{marginBottom:24}}>
              <span style={{display:'inline-block',background:'var(--surface-2)',padding:'8px 16px',borderRadius:'999px',fontSize:'14px',fontWeight:600,border:'1px solid var(--ring)'}}>
                {product.category === 'CLOTHING' ? 'Аксессуары' : 'БАДы'}
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
            {product.features && typeof product.features === 'object' && !features?.outOfStock && (
              <div style={{marginBottom:32}}>
                <h2 className="font-display" style={{fontSize:'20px',marginBottom:12}}>Характеристики</h2>
                <dl style={{display:'grid',gap:8}}>
                  {Object.entries(product.features as Record<string, any>)
                    .filter(([key]) => key !== 'ozonLink' && key !== 'outOfStock')
                    .map(([key, value]) => (
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

            {/* Quality guarantee - Only for keychain */}
            {isKeychain && (
              <div className="tile" style={{marginTop:32,background:'rgba(76,175,80,0.1)',border:'2px solid rgba(76,175,80,0.3)',padding:24}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                  <span style={{fontSize:'32px'}}>✓</span>
                  <div>
                    <h3 className="font-display" style={{fontSize:'20px',marginBottom:4}}>
                      Гарантия качества
                    </h3>
                    <p className="lead" style={{fontSize:'14px',lineHeight:1.6}}>
                      Премиальные материалы, надёжная металлическая цепочка. Возврат в течение 14 дней.
                    </p>
                  </div>
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
