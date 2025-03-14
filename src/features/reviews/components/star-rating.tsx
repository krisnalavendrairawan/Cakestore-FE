import { Star, StarOff } from 'lucide-react'

const StarRating = ({ rating }: { rating: number }) => {
  const stars = []
  const totalStars = 5
  
  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(
        <Star
          key={i}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      )
    } else {
      stars.push(
        <StarOff
          key={i}
          size={16}
          className="text-gray-300"
        />
      )
    }
  }

  return <div className="flex gap-0.5">{stars}</div>
}

export default StarRating