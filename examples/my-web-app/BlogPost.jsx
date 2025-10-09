import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import FloatingParticles from './shared/FloatingParticles'
import Footer from './Footer'
import SEOHead from './SEOHead'
import Tooltip from './Tooltip'
import { API_ENDPOINTS } from '../config/constants'
import { formatDate } from '../utils/formatters'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.POST_BY_SLUG(slug))

      if (!response.ok) {
        throw new Error('Failed to fetch blog post')
      }

      const result = await response.json()
      setPost(result.data)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  // Memoize SEO data computation using relational SEO collection
  // This must be before any conditional returns to follow Rules of Hooks
  const seoMetadata = useMemo(() => {
    if (!post) return {
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      imageUrl: null,
      imageAlt: '',
      canonicalUrl: '',
      noIndex: false,
      noFollow: false,
      structuredData: null
    };

    const seoData = post.seo_id || {};
    const seoTitle = seoData.meta_title || post.title;
    const seoDescription = seoData.meta_description || post.excerpt;
    const seoKeywords = seoData.meta_keywords || '';
    const seoImage = seoData.og_image || post.featured_image;
    const canonicalUrl = seoData.canonical_url || `${window.location.origin}/blog/${post.slug}`;
    const noIndex = seoData.no_index || false;
    const noFollow = seoData.no_follow || false;

    // Get image URL and alt text (via Express server for authentication)
    const imageUrl = seoImage ? API_ENDPOINTS.ASSET(seoImage) : null;
    const imageAlt = post.featured_image?.description || post.title;

    // Build structured data for article
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": seoDescription,
      "image": imageUrl,
      "datePublished": post.publish_date || post.date_created,
      "dateModified": post.date_updated,
      "author": {
        "@type": "Person",
        "name": post.author || "zSpace"
      },
      "publisher": {
        "@type": "Organization",
        "name": "zSpace",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${post.slug}`
      }
    };

    return {
      seoTitle,
      seoDescription,
      seoKeywords,
      imageUrl,
      imageAlt,
      canonicalUrl,
      noIndex,
      noFollow,
      structuredData
    };
  }, [post]);

  const { seoTitle, seoDescription, seoKeywords, imageUrl, imageAlt, canonicalUrl, noIndex, noFollow, structuredData } = seoMetadata;

  // Early returns AFTER all hooks
  if (loading) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[rgb(var(--text-secondary))]">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card-elevated p-8 text-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Post not found</h3>
            <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={imageUrl}
        imageAlt={imageAlt}
        url={canonicalUrl}
        type="article"
        noIndex={noIndex}
        noFollow={noFollow}
        structuredData={structuredData}
        author={post.author}
        publishedTime={post.publish_date || post.date_created}
        modifiedTime={post.date_updated}
      />
      <div className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Three.js stars - same as Hero */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={2} />
            <FloatingParticles />
          </Canvas>
        </div>

        {/* Animated gradient background - dark mode only */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950"></div>
          {/* Animated blobs - same as Hero */}
          <div className="absolute inset-0">
            <div className="absolute w-[500px] h-[500px] -top-20 -left-20 bg-blue-400/30 rounded-full blur-3xl animate-blob-1"></div>
            <div className="absolute w-[600px] h-[600px] top-40 -right-32 bg-pink-400/30 rounded-full blur-3xl animate-blob-2"></div>
            <div className="absolute w-[550px] h-[550px] -bottom-32 left-1/4 bg-purple-400/30 rounded-full blur-3xl animate-blob-3"></div>
            <div className="absolute w-[450px] h-[450px] top-1/3 left-1/2 bg-cyan-400/25 rounded-full blur-3xl animate-blob-4"></div>
            <div className="absolute w-[500px] h-[500px] bottom-20 right-1/4 bg-teal-400/25 rounded-full blur-3xl animate-blob-5"></div>
          </div>
        </div>

        {/* Main content area - grows to push footer down */}
        <div className="flex-grow pt-32 pb-20 px-4 relative">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-gray-300">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-gray-500" aria-hidden="true">→</li>
                {post.status === 'archived' && (
                  <>
                    <li>
                      <Link
                        to="/archive"
                        className="hover:text-blue-400 transition-colors"
                      >
                        Archived
                      </Link>
                    </li>
                    <li className="text-gray-500" aria-hidden="true">→</li>
                  </>
                )}
                <li className="text-white truncate max-w-md" aria-current="page">
                  {post.title}
                </li>
              </ol>
            </nav>

            <article className="card-elevated overflow-hidden bg-gradient-to-b from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-md border-2 border-blue-500/30">
              {(post.featured_image || post.featured_image_url || post.external_image_url) && (
                <div className="relative h-96 bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-400 overflow-hidden">
                  <img
                    src={post.external_image_url || post.featured_image_url || API_ENDPOINTS.ASSET(post.featured_image)}
                    alt={post.featured_image?.description || post.title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay for better contrast with content below */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent"></div>
                </div>
              )}

              <div className="p-8 md:p-12 relative">
                {/* Decorative accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500"></div>

                {(post.display_date || post.date_created) && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {formatDate(post.display_date || post.date_created)}
                    </p>
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Category Tags */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.categories.map((category) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 text-sm font-semibold bg-blue-500 text-white rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

                {post.excerpt && (
                  <div className="relative mb-8">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    <p className="text-xl text-[rgb(var(--text-secondary))] italic pl-4 border-l-4 border-transparent">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                {post.content && (
                  <div
                    className="prose prose-lg prose-invert max-w-none prose-h1:bg-gradient-to-r prose-h1:from-purple-500 prose-h1:to-purple-300 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:!text-transparent prose-h2:bg-gradient-to-r prose-h2:from-purple-500 prose-h2:to-purple-300 prose-h2:bg-clip-text prose-h2:text-transparent prose-h2:!text-transparent prose-h3:bg-gradient-to-r prose-h3:from-purple-500 prose-h3:to-purple-300 prose-h3:bg-clip-text prose-h3:text-transparent prose-h3:!text-transparent prose-h4:bg-gradient-to-r prose-h4:from-purple-500 prose-h4:to-purple-300 prose-h4:bg-clip-text prose-h4:text-transparent prose-h4:!text-transparent prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-purple-300"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}

                {/* Decorative bottom accent */}
                <div className="mt-12 pt-8 border-t-2 border-gradient-to-r from-transparent via-purple-800 to-transparent">
                  <Tooltip content={post.status === 'archived' ? "Return to archived posts" : "Return to homepage"} position="right">
                    <Link
                      to={post.status === 'archived' ? "/archive" : "/"}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold group"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> {post.status === 'archived' ? 'Back to archived posts' : 'Back to all posts'}
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Footer - always at bottom */}
        <div className="relative mt-auto">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default memo(BlogPost)
