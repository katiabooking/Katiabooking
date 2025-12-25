import { Download, Share2, Send, Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { GiftCardTheme, GiftCardThemePreset, GIFT_CARD_THEMES, SalonGiftCardBranding } from '../types/giftCardTemplates';
import { useCurrency } from '../../contexts/CurrencyContext';

interface GiftCardPreviewProps {
  code?: string;
  amount: number;
  salonName: string;
  theme: GiftCardTheme;
  recipientName?: string;
  senderName?: string;
  purchaserName?: string;
  personalMessage?: string;
  message?: string;
  salonBranding?: SalonGiftCardBranding;
  onShare?: (method: 'email' | 'whatsapp' | 'instagram' | 'download') => void;
}

export function GiftCardPreview({
  code = 'PREVIEW',
  amount,
  salonName,
  theme,
  recipientName = '',
  senderName = '',
  purchaserName = '',
  personalMessage = '',
  message = '',
  salonBranding,
  onShare,
}: GiftCardPreviewProps) {
  const { formatPrice } = useCurrency();
  const themePreset = GIFT_CARD_THEMES[theme];
  
  // Use either senderName or purchaserName, whichever is provided
  const fromName = senderName || purchaserName;
  const displayMessage = personalMessage || message;

  return (
    <div className="space-y-4">
      {/* Beautiful Gift Card Visual */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
        {/* Background with theme */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: salonBranding?.brandColors?.primary || themePreset.backgroundColor 
          }}
        />

        {/* Pattern overlay */}
        {themePreset.backgroundPattern && (
          <div className="absolute inset-0 opacity-10">
            <BackgroundPattern pattern={themePreset.backgroundPattern} />
          </div>
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col p-8">
          {/* Header: Logo + Salon Name */}
          <div className="flex items-center justify-between mb-auto">
            {/* Salon Logo */}
            {salonBranding?.logo ? (
              <img 
                src={salonBranding.logo} 
                alt={salonName}
                className="h-12 w-auto object-contain bg-white/90 rounded-lg px-3 py-2"
              />
            ) : (
              <div className="bg-white/90 rounded-lg px-4 py-2">
                <h3 
                  className="font-bold text-xl"
                  style={{ color: themePreset.accentColor }}
                >
                  {salonName}
                </h3>
              </div>
            )}

            {/* Theme Emoji */}
            <div className="text-4xl opacity-80">
              {themePreset.emoji}
            </div>
          </div>

          {/* Center: Main Content */}
          <div className="text-center space-y-4">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: themePreset.textColor }}
              >
                GIFT CARD
              </h2>
              <p 
                className="text-sm opacity-90"
                style={{ color: themePreset.textColor }}
              >
                {themePreset.name}
              </p>
            </div>

            {/* Amount */}
            <div 
              className="text-5xl md:text-6xl font-bold"
              style={{ color: themePreset.accentColor }}
            >
              {formatPrice(amount)}
            </div>

            {/* Recipient */}
            {recipientName && (
              <div 
                className="text-lg"
                style={{ color: themePreset.textColor }}
              >
                For: <span className="font-semibold">{recipientName}</span>
              </div>
            )}

            {/* Personal Message */}
            {displayMessage && (
              <div 
                className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-4"
                style={{ color: themePreset.textColor }}
              >
                <p className="text-sm italic">"{displayMessage}"</p>
                {fromName && (
                  <p className="text-xs mt-2 opacity-80">- {fromName}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer: Code + Signature */}
          <div className="mt-auto space-y-3">
            {/* Gift Card Code */}
            <div className="bg-white/95 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 mb-1">Gift Card Code</p>
              <p className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                {code}
              </p>
            </div>

            {/* Owner Signature */}
            {salonBranding?.ownerSignature && (
              <div 
                className="text-center text-sm"
                style={{ color: themePreset.textColor }}
              >
                {salonBranding.ownerSignature.signatureImage ? (
                  <img 
                    src={salonBranding.ownerSignature.signatureImage}
                    alt="Signature"
                    className="h-8 mx-auto opacity-80"
                  />
                ) : (
                  <div className="opacity-80">
                    <p className="font-cursive">{salonBranding.ownerSignature.name}</p>
                    <p className="text-xs">{salonBranding.ownerSignature.title}</p>
                  </div>
                )}
              </div>
            )}

            {/* Custom Footer */}
            {salonBranding?.customFooter && (
              <p 
                className="text-xs text-center opacity-80"
                style={{ color: themePreset.textColor }}
              >
                {salonBranding.customFooter}
              </p>
            )}
          </div>
        </div>

        {/* Decorative corner elements */}
        <div 
          className="absolute top-0 left-0 w-20 h-20 opacity-20"
          style={{ 
            background: `radial-gradient(circle at top left, ${themePreset.accentColor} 0%, transparent 70%)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-20 h-20 opacity-20"
          style={{ 
            background: `radial-gradient(circle at bottom right, ${themePreset.accentColor} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Share Actions */}
      {onShare && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 text-sm text-gray-700">Share Gift Card</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('download')}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('email')}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('whatsapp')}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('instagram')}
              className="gap-2"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            💡 Tip: Download the image to share on social media or print it!
          </p>
        </Card>
      )}
    </div>
  );
}

/**
 * Background Pattern Component
 */
function BackgroundPattern({ pattern }: { pattern: 'hearts' | 'flowers' | 'stars' | 'confetti' | 'snowflakes' }) {
  const patterns = {
    hearts: '❤️',
    flowers: '🌸',
    stars: '⭐',
    confetti: '🎉',
    snowflakes: '❄️',
  };

  const emoji = patterns[pattern];

  return (
    <div className="w-full h-full relative">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.3,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}