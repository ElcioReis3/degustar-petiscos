import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
}

export function StarRating({ rating, reviews }: StarRatingProps) {
  const filled = Math.round(rating);

  return (
    <div
      className="flex items-center gap-1 text-xs text-amber-400"
      aria-label={`${rating} de 5 estrelas — ${reviews} avaliações`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < filled ? "currentColor" : "none"}
          aria-hidden
        />
      ))}

      <span className="text-muted-foreground ml-1">
        {rating}
        {reviews !== undefined && `(${reviews})`}
      </span>
    </div>
  );
}
