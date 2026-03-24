import { useState, useEffect } from 'react';
import { Star, MessageSquare, Filter } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { mockProviderReviews } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0
  });

  useEffect(() => {
    // Use mock data
    setReviews(mockProviderReviews);

    // Calculate stats
    const totalReviews = mockProviderReviews.length;
    const averageRating = totalReviews > 0
      ? mockProviderReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingCounts = {
      fiveStars: mockProviderReviews.filter(r => r.rating === 5).length,
      fourStars: mockProviderReviews.filter(r => r.rating === 4).length,
      threeStars: mockProviderReviews.filter(r => r.rating === 3).length,
      twoStars: mockProviderReviews.filter(r => r.rating === 2).length,
      oneStars: mockProviderReviews.filter(r => r.rating === 1).length
    };

    setStats({
      averageRating,
      totalReviews,
      ...ratingCounts
    });
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, ratingFilter]);

  const filterReviews = () => {
    if (ratingFilter === 'all') {
      setFilteredReviews(reviews);
    } else {
      const rating = parseInt(ratingFilter);
      setFilteredReviews(reviews.filter(r => r.rating === rating));
    }
  };

  const getRatingPercentage = (count) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 md:pt-0">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div 
            className="mb-6"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            <h1 className="text-3xl mb-2 text-foreground">Customer Reviews</h1>
            <p className="text-muted-foreground">See what your customers are saying</p>
          </motion.div>

          {/* Overall Rating */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-2">Average Rating</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                      <span className="text-foreground text-5xl">{stats.averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Based on {stats.totalReviews} reviews</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="lg:col-span-2 bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                <CardHeader>
                  <CardTitle className="text-foreground">Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { stars: 5, count: stats.fiveStars },
                      { stars: 4, count: stats.fourStars },
                      { stars: 3, count: stats.threeStars },
                      { stars: 2, count: stats.twoStars },
                      { stars: 1, count: stats.oneStars }
                    ].map(({ stars, count }) => (
                      <div key={stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-24">
                          <span className="text-foreground text-sm">{stars}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-full transition-all duration-500"
                            style={{ width: `${getRatingPercentage(count)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground text-sm w-12 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Filter */}
          <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
            <CardContent className="pt-6">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card className="bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
            <CardContent className="pt-6">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map(review => (
                    <div
                      key={review.id}
                      className="p-6 rounded-xl bg-(--surface) border border-border/40 hover:bg-secondary/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-foreground mb-1">{review.customer_name}</h3>
                          <p className="text-muted-foreground text-sm">{review.skill_name}</p>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-foreground leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}