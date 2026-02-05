import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera, Grid3X3, Heart, Share2, Download, Menu } from 'lucide-react'

// Gallery data with user provided images
const galleryItems = [
  {
    id: 1,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    category: 'portrait',
    title: 'Портретная съемка',
    description: 'Профессиональная портретная фотография',
    size: 'large'
  },
  {
    id: 2,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    category: 'landscape',
    title: 'Пейзаж',
    description: 'Природные красоты',
    size: 'medium'
  },
  {
    id: 3,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    category: 'architecture',
    title: 'Архитектура',
    description: 'Городские пейзажи',
    size: 'medium'
  }
]

const categories = [
  { id: 'all', label: 'Все работы', icon: Grid3X3 },
  { id: 'portrait', label: 'Портреты', icon: Camera },
  { id: 'landscape', label: 'Пейзажи', icon: Heart },
  { id: 'architecture', label: 'Архитектура', icon: Share2 }
]

// Utility for class merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

// Safe Icon component
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const iconMap = {
    'x': X,
    'zoom-in': ZoomIn,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'camera': Camera,
    'grid-3x3': Grid3X3,
    'heart': Heart,
    'share-2': Share2,
    'download': Download,
    'menu': Menu
  }

  const IconComponent = iconMap[name] || (() => null)

  return <IconComponent size={size} className={className} color={color} />
}

// Lightbox Component
const Lightbox = ({ item, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasNext) onNext()
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl lightbox-scroll"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Закрыть"
      >
        <SafeIcon name="x" size={24} className="text-white" />
      </button>

      {/* Navigation buttons */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Предыдущее"
        >
          <SafeIcon name="chevron-left" size={32} className="text-white" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Следующее"
        >
          <SafeIcon name="chevron-right" size={32} className="text-white" />
        </button>
      )}

      {/* Image container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-7xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
          <p className="text-gray-300">{item.description}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Gallery Item Component
const GalleryItem = ({ item, index, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-900",
        item.size === 'large' ? 'md:col-span-2 md:row-span-2' : '',
        item.size === 'medium' ? 'md:col-span-1 md:row-span-1' : ''
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className={cn(
        "relative overflow-hidden",
        item.size === 'large' ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square'
      )}>
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <SafeIcon name="zoom-in" size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.description}</p>
          </motion.div>
        </div>

        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium uppercase tracking-wider">
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Filter gallery items
  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

  // Lightbox navigation
  const currentIndex = selectedImage ? filteredItems.findIndex(item => item.id === selectedImage.id) : -1
  const hasNext = currentIndex < filteredItems.length - 1
  const hasPrev = currentIndex > 0

  const handleNext = useCallback(() => {
    if (hasNext) {
      setSelectedImage(filteredItems[currentIndex + 1])
    }
  }, [currentIndex, filteredItems, hasNext])

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setSelectedImage(filteredItems[currentIndex - 1])
    }
  }, [currentIndex, filteredItems, hasPrev])

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-xl z-40 border-b border-white/10">
        <nav className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                <SafeIcon name="camera" size={24} className="text-white" />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight">GALLERY</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#gallery" className="text-gray-400 hover:text-white transition-colors font-medium">Галерея</a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors font-medium">О проекте</a>
              <button className="bg-white text-zinc-950 px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
                Контакты
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon name="menu" size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-4 border-t border-white/10 mt-4">
                  <a href="#gallery" className="block text-gray-400 hover:text-white transition-colors">Галерея</a>
                  <a href="#about" className="block text-gray-400 hover:text-white transition-colors">О проекте</a>
                  <button className="w-full bg-white text-zinc-950 px-6 py-2 rounded-full font-bold">
                    Контакты
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Фотогалерея
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Коллекция лучших работ. Каждый кадр — это история,
              застывшая во времени. Погрузитесь в мир визуального искусства.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-red-600/25"
            >
              Смотреть работы
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
                    isActive
                      ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  )}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              )
            })}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item, index) => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 text-lg">Нет работ в этой категории</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-zinc-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                О проекте
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Эта галерея представляет собой коллекцию лучших фотографических работ,
                отобранных за многие годы творческой деятельности. Каждая фотография
                несет в себе уникальную историю и эмоцию.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Мы стремимся к совершенству в каждом кадре, используя современное
                оборудование и передовые техники обработки изображений.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-red-500 mb-1">150+</div>
                  <div className="text-sm text-gray-500">Проектов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-red-500 mb-1">50+</div>
                  <div className="text-sm text-gray-500">Клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-red-500 mb-1">10+</div>
                  <div className="text-sm text-gray-500">Лет опыта</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?"
                  alt="About"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-white/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <SafeIcon name="camera" size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold">GALLERY</span>
            </div>

            <div className="flex gap-6">
              <button className="text-gray-500 hover:text-white transition-colors">
                <SafeIcon name="share-2" size={20} />
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                <SafeIcon name="download" size={20} />
              </button>
            </div>

            <p className="text-gray-500 text-sm">
              © 2024 Gallery. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            item={selectedImage}
            onClose={() => setSelectedImage(null)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App