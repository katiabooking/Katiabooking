import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar, 
  Star, 
  Zap, 
  TrendingUp 
} from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface PublicFeedPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  // Service details
  serviceName: string;
  serviceCategory: string;
  originalPrice: number;
  discount: number;
  currency: string;
  isLastMinute: boolean;
  isPromoted: boolean;
  duration: number;
  serviceDescription: string;
  // Salon details
  salonId: string;
  salonName: string;
  salonAvatar: string;
  salonLocation: string;
  salonRating: number;
}

export function PublicFeedPage() {
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  // Mock data - в реальном приложении это будет из backend
  const [publicPosts] = useState<PublicFeedPost[]>([
    {
      id: 'promo-1',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxheWFnZSUyMGhhaXIlMjBjb2xvcnxlbnwxfHx8fDE3NjYzMzIyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 342,
      comments: 68,
      shares: 45,
      date: '2 hours ago',
      serviceName: 'Balayage Hair Coloring',
      serviceCategory: 'Hair Coloring',
      originalPrice: 150,
      discount: 25,
      currency: 'USD',
      isLastMinute: false,
      isPromoted: true,
      duration: 180,
      serviceDescription: 'Professional balayage technique with premium Olaplex products. Includes consultation, coloring, toning, and blow-dry styling.',
      salonId: '1',
      salonName: 'Glamour Studio',
      salonAvatar: 'G',
      salonLocation: 'Downtown, New York',
      salonRating: 4.8
    },
    {
      id: 'promo-2',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwc3BhfGVufDF8fHx8MTc2NjMzMjIzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 256,
      comments: 42,
      shares: 28,
      date: '4 hours ago',
      serviceName: 'Deep Tissue Massage',
      serviceCategory: 'Spa Treatment',
      originalPrice: 90,
      discount: 0,
      currency: 'USD',
      isLastMinute: true,
      isPromoted: false,
      duration: 60,
      serviceDescription: 'Therapeutic deep tissue massage to relieve muscle tension. Perfect for stress relief and recovery.',
      salonId: '2',
      salonName: 'Bella Vista Spa',
      salonAvatar: 'B',
      salonLocation: 'Midtown, New York',
      salonRating: 4.9
    },
    {
      id: 'promo-3',
      image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY3VyZSUyMG5haWxzfGVufDF8fHx8MTc2NjMzMjIzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 412,
      comments: 89,
      shares: 56,
      date: '1 day ago',
      serviceName: 'Gel Manicure + Nail Art',
      serviceCategory: 'Manicure & Pedicure',
      originalPrice: 65,
      discount: 15,
      currency: 'USD',
      isLastMinute: false,
      isPromoted: true,
      duration: 90,
      serviceDescription: 'Long-lasting gel manicure with custom nail art design. Includes hand massage and cuticle care.',
      salonId: '3',
      salonName: 'Luxury Nails & Spa',
      salonAvatar: 'L',
      salonLocation: 'Brooklyn, New York',
      salonRating: 4.7
    },
    {
      id: 'promo-4',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzY2MzMyMjM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 189,
      comments: 34,
      shares: 21,
      date: '5 hours ago',
      serviceName: 'Hydrating Facial Treatment',
      serviceCategory: 'Facial Treatment',
      originalPrice: 120,
      discount: 30,
      currency: 'USD',
      isLastMinute: true,
      isPromoted: false,
      duration: 75,
      serviceDescription: 'Intensive hydration facial with hyaluronic acid and vitamin C. Leaves skin glowing and refreshed.',
      salonId: '4',
      salonName: 'Elite Hair Lounge',
      salonAvatar: 'E',
      salonLocation: 'Upper East Side, New York',
      salonRating: 4.6
    },
    {
      id: 'promo-5',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyY3V0JTIwc3R5bGluZ3xlbnwxfHx8fDE3NjYzMzIyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 298,
      comments: 51,
      shares: 33,
      date: '1 day ago',
      serviceName: 'Premium Haircut & Styling',
      serviceCategory: 'Hair Styling',
      originalPrice: 75,
      discount: 0,
      currency: 'USD',
      isLastMinute: false,
      isPromoted: true,
      duration: 60,
      serviceDescription: 'Expert haircut with personalized styling. Includes wash, cut, blow-dry, and styling products.',
      salonId: '1',
      salonName: 'Glamour Studio',
      salonAvatar: 'G',
      salonLocation: 'Downtown, New York',
      salonRating: 4.8
    },
    {
      id: 'promo-6',
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVsYXNoJTIwZXh0ZW5zaW9uc3xlbnwxfHx8fDE3NjYzMzIyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 367,
      comments: 72,
      shares: 41,
      date: '6 hours ago',
      serviceName: 'Classic Eyelash Extensions',
      serviceCategory: 'Eyelashes & Brows',
      originalPrice: 140,
      discount: 20,
      currency: 'USD',
      isLastMinute: true,
      isPromoted: false,
      duration: 120,
      serviceDescription: 'Full set of classic individual lash extensions. Natural look with dramatic effect.',
      salonId: '5',
      salonName: 'The Beauty Bar',
      salonAvatar: 'T',
      salonLocation: 'Chelsea, New York',
      salonRating: 4.9
    }
  ]);

  const categories = [
    'All',
    'Hair Styling',
    'Hair Coloring',
    'Manicure & Pedicure',
    'Facial Treatment',
    'Massage',
    'Spa Treatment',
    'Eyelashes & Brows',
    'Makeup',
    'Waxing'
  ];

  // Sort: promoted first, then by date
  const sortedPosts = [...publicPosts]
    .filter(post => selectedCategory === 'All' || post.serviceCategory === selectedCategory)
    .sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      return 0;
    });

  const handleBookService = (post: PublicFeedPost) => {
    // Navigate to salon page with service pre-selected
    navigate(`/salon/${post.salonId}`, {
      state: {
        openBooking: true,
        selectedService: {
          name: post.serviceName,
          category: post.serviceCategory,
          price: post.originalPrice,
          discount: post.discount,
          duration: post.duration
        }
      }
    });
  };

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
    // TODO: Implement like functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ✨ Discover Beauty Services
            </h1>
            <p className="text-lg md:text-xl text-purple-100 mb-2">
              Exclusive deals and promotions from top salons in your area
            </p>
            <p className="text-sm text-purple-200">
              Book instantly with special discounts and last-minute offers
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            
            {/* Left Arrow - показываем только если категорий > 8 */}
            {categories.length > 8 && (
              <button
                onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                disabled={carouselIndex === 0}
                className="flex-shrink-0 bg-white hover:bg-gray-50 shadow-md rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
              >
                <ChevronLeft className="w-5 h-5 text-purple-600" />
              </button>
            )}

            {/* Categories Container with Overflow Hidden */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex gap-3 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 140}px)` }}
              >
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow - показываем только если категорий > 8 */}
            {categories.length > 8 && (
              <button
                onClick={() => setCarouselIndex(Math.min(categories.length - 8, carouselIndex + 1))}
                disabled={carouselIndex >= categories.length - 8}
                className="flex-shrink-0 bg-white hover:bg-gray-50 shadow-md rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-purple-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Feed - Instagram Style Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedPosts.map(post => (
              <Card key={post.id} className={`overflow-hidden group hover:shadow-2xl transition-all ${
                post.isPromoted ? 'ring-2 ring-yellow-400' : ''
              }`}>
                {/* Photo with Overlay */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.serviceName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                    {/* Left: Last Minute / Promoted */}
                    <div className="flex flex-col gap-1">
                      {post.isLastMinute && (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          LAST
                        </div>
                      )}
                      {post.isPromoted && (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          TOP
                        </div>
                      )}
                    </div>

                    {/* Right: Discount Badge */}
                    {post.discount > 0 && (
                      <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg">
                        <div className="text-xl font-bold">-{post.discount}%</div>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay - Instagram Style */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      {/* Engagement Stats */}
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-white" />
                          <span className="font-bold">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-bold">{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span className="font-bold">{post.shares}</span>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="mb-2">
                        <div className="text-xs text-purple-300 mb-1">{post.serviceCategory}</div>
                        <div className="font-bold text-sm mb-1 line-clamp-1">{post.serviceName}</div>
                        <p className="text-xs text-gray-200 line-clamp-2 mb-2">{post.serviceDescription}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>{post.duration}min</span>
                          <span className="mx-1">•</span>
                          {post.discount > 0 ? (
                            <>
                              <span className="line-through text-gray-300 text-xs">
                                {formatPrice(post.originalPrice)}
                              </span>
                              <span className="font-bold text-green-400">
                                {formatPrice(post.originalPrice * (1 - post.discount / 100))}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold">
                              {formatPrice(post.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Always Visible */}
                <div className="p-3 bg-white">
                  {/* Salon Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {post.salonAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">{post.salonName}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{post.salonRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Title */}
                  <div className="mb-2">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                      {post.serviceName}
                    </h4>
                    <div className="text-xs text-purple-600">{post.serviceCategory}</div>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    {post.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(post.originalPrice)}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(post.originalPrice * (1 - post.discount / 100))}
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(post.originalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <Button 
                    className="w-full h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm"
                    onClick={() => handleBookService(post)}
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 inline-block">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-gray-600 max-w-2xl">
                Look for <span className="text-orange-600 font-bold">⚡ Last Minute</span> deals for same-day availability 
                and <span className="text-yellow-600 font-bold">Featured</span> promotions for the best discounts!
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}