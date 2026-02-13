import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmark } from '@/hooks/useBookmark';

interface BookmarkButtonProps {
  placeName: string;
  placeData?: {
    description?: string;
    category?: string;
    image_url?: string;
    location?: string;
  };
  variant?: 'icon' | 'full' | 'overlay';
  className?: string;
}

const BookmarkButton = ({ placeName, placeData, variant = 'icon', className = '' }: BookmarkButtonProps) => {
  const { isSaved, loading, toggleSave } = useBookmark(placeName, placeData);

  if (variant === 'overlay') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSave();
        }}
        disabled={loading}
        className={`bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
          isSaved ? 'text-nepal-gold' : 'text-foreground'
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
      </Button>
    );
  }

  if (variant === 'full') {
    return (
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSave();
        }}
        disabled={loading}
        className={`${isSaved ? 'text-nepal-gold border-nepal-gold' : ''} ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : isSaved ? (
          <BookmarkCheck className="w-4 h-4 mr-2" />
        ) : (
          <Bookmark className="w-4 h-4 mr-2" />
        )}
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave();
      }}
      disabled={loading}
      className={`${isSaved ? 'text-nepal-gold' : ''} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </Button>
  );
};

export default BookmarkButton;
