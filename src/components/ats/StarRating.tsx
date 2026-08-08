import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number | null;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

/** 1-5 reviewer rating. Interactive unless {@code readOnly}. */
const StarRating = ({ value, onChange, readOnly = false, size = 16 }: StarRatingProps) => {
  const rating = value ?? 0;

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5" aria-label={value ? `Rated ${value} of 5` : "Not rated"}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            aria-hidden="true"
            className={cn(
              star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          aria-label={`Rate ${star} of 5`}
          aria-pressed={star === rating}
          className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            size={size}
            aria-hidden="true"
            className={cn(
              star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
