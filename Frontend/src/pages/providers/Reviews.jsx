import { useState, useEffect } from 'react';
import {
  Star, MessageSquare, Filter, ThumbsUp, TrendingUp, Award,
  User, Calendar, CheckCircle, AlertTriangle, Search, X, Quote
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { mockProviderReviews } from '../../data/providerMockData';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
};

export default function ProviderReviewsPage() {
  const [reviews] = useState(mockProviderReviews);
  const [filteredReviews, setFilteredReviews] = useState(mockProviderReviews);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  const satisfaction = Math.round(((ratingCounts[5] + ratingCounts[4]) / totalReviews) * 100);

  useEffect(() => {
    let filtered = [...reviews];
    if (ratingFilter !== 'all') filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
    if (searchQuery) filtered = filtered.filter(r =>
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === 'highest') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'helpful') filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    else filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredReviews(filtered);
  }, [reviews, ratingFilter, searchQuery, sortBy]);

  const radialData = [{ name: 'Rating', value: (avgRating / 5) * 100, fill: '#F59E0B' }];

  return (
    <div className="min-h-screen bg-background">

      <div className="p-4 md:p-6 pt-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
            <div className="mt-3">
              <h1 className="text-2xl md:text-3xl text-foreground">Customer Reviews</h1>
              <p className="text-muted-foreground text-sm mt-1">See what your clients say about your work</p>
            </div>
          </motion.div>

          {/* Overview Section */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5"
            initial="hidden" animate="visible" variants={containerVariants}>

            {/* Score Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-linear-to-br from-amber-500/10 via-card to-(--surface) border border-amber-400/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="relative mx-auto mb-2" style={{ width: 140, height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                        data={radialData} startAngle={90} endAngle={-270}>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" cornerRadius={10} fill="#F59E0B" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Star className="h-5 w-5 text-amber-400 fill-amber-400 mb-1" />
                      <span className="text-foreground text-2xl">{avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-foreground mb-1">Overall Rating</p>
                  <p className="text-muted-foreground text-sm">Based on {totalReviews} reviews</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/25'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rating Distribution */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-lg h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">Rating Distribution</CardTitle>
                  <CardDescription>{satisfaction}% of clients rated 4★ or higher</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = ratingCounts[stars];
                      const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <button key={stars} onClick={() => setRatingFilter(stars === parseInt(ratingFilter) ? 'all' : String(stars))}
                          className={`w-full flex items-center gap-3 group rounded-lg p-1 transition-colors ${ratingFilter === String(stars) ? 'bg-amber-500/5' : 'hover:bg-secondary/50'}`}>
                          <div className="flex items-center gap-1 w-14 shrink-0">
                            <span className="text-muted-foreground text-sm w-3">{stars}</span>
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          </div>
                          <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${stars >= 4 ? 'bg-amber-400' : stars === 3 ? 'bg-yellow-600' : 'bg-red-400'}`}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.3 + (5 - stars) * 0.07, duration: 0.7, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs w-8 text-right shrink-0">{count}</span>
                          <span className="text-muted-foreground text-xs w-10 text-right shrink-0">{pct.toFixed(0)}%</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <div className="flex-1 p-3 rounded-xl bg-green-500/8 border border-green-400/20 text-center">
                      <p className="text-green-600 text-lg">{satisfaction}%</p>
                      <p className="text-muted-foreground text-xs">Satisfied</p>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-blue-500/8 border border-blue-400/20 text-center">
                      <p className="text-blue-600 text-lg">{reviews.reduce((s, r) => s + (r.helpful || 0), 0)}</p>
                      <p className="text-muted-foreground text-xs">Helpful votes</p>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-purple-500/8 border border-purple-400/20 text-center">
                      <p className="text-purple-600 text-lg">{ratingCounts[5]}</p>
                      <p className="text-muted-foreground text-xs">5★ Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Featured Review */}
          {reviews.find(r => r.rating === 5) && (
            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="bg-linear-to-r from-blue-600 via-indigo-700 to-blue-800 border-0 shadow-xl text-white overflow-hidden">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <Quote className="h-8 w-8 text-blue-300 shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-blue-100 text-xs mb-2 flex items-center gap-1">
                        <Award className="h-3 w-3" /> Featured Review
                      </p>
                      <p className="text-white text-base md:text-lg leading-relaxed italic mb-3">
                        "{reviews.find(r => r.rating === 5)?.comment}"
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={reviews.find(r => r.rating === 5)?.customer_avatar}
                          alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/30"
                        />
                        <div>
                          <p className="text-white text-sm">{reviews.find(r => r.rating === 5)?.customer_name}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-300 text-amber-300" />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search & Filters */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <Card className="bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search reviews..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-9" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-full sm:w-40 h-9">
                      <Star className="h-3.5 w-3.5 mr-1.5 text-amber-400 fill-amber-400" />
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      {[5, 4, 3, 2, 1].map(n => <SelectItem key={n} value={String(n)}>{n} Stars</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={v => setSortBy(v)}>
                    <SelectTrigger className="w-full sm:w-37.5 h-9">
                      <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                      <SelectItem value="helpful">Most Helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reviews Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing <span className="text-foreground">{filteredReviews.length}</span> of {totalReviews} reviews
            </p>
            {(ratingFilter !== 'all' || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={() => { setRatingFilter('all'); setSearchQuery(''); }}
                className="text-xs text-muted-foreground gap-1">
                <X className="h-3 w-3" /> Clear filters
              </Button>
            )}
          </div>

          {/* Reviews List */}
          <AnimatePresence mode="wait">
            {filteredReviews.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16 text-muted-foreground">
                <MessageSquare className="h-14 w-14 mx-auto mb-4 opacity-25" />
                <p>No reviews match your filters</p>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3" initial="hidden" animate="visible" variants={containerVariants}>
                {filteredReviews.map((review) => (
                  <motion.div key={review.id} variants={itemVariants} whileHover={{ scale: 1.005 }}
                    className="rounded-2xl bg-linear-to-br from-card to-(--surface) border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Rating color strip */}
                    <div className={`h-1 ${review.rating === 5 ? 'bg-amber-400' : review.rating === 4 ? 'bg-yellow-500' : review.rating === 3 ? 'bg-orange-400' : 'bg-red-400'}`} />
                    
                    <div className="p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={review.customer_avatar || `https://ui-avatars.com/api/?name=${review.customer_name}&background=6366f1&color=fff`}
                            alt={review.customer_name} className="h-10 w-10 rounded-xl object-cover ring-2 ring-border shrink-0" />
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span className="text-foreground">{review.customer_name}</span>
                              {review.order_type === 'urgent' && (
                                <Badge className="bg-orange-500/10 text-orange-600 border border-orange-400/20 text-xs gap-1">
                                  <AlertTriangle className="h-2.5 w-2.5" /> Urgent Order
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-0.5">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/25'}`} />
                              ))}
                              <span className="text-muted-foreground text-xs ml-1">({review.rating}.0)</span>
                            </div>
                            <p className="text-muted-foreground text-xs">{review.skill_name}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-muted-foreground text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          {review.helpful && (
                            <div className="flex items-center gap-1 justify-end mt-1">
                              <ThumbsUp className="h-3 w-3 text-blue-500" />
                              <span className="text-muted-foreground text-xs">{review.helpful} helpful</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {review.comment && (
                        <div className="bg-secondary/50 rounded-xl p-3 mb-3">
                          <p className="text-foreground text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      )}

                      {/* Provider Response placeholder */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {review.rating >= 4 && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3" /> Positive
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground gap-1">
                          <MessageSquare className="h-3 w-3" /> Reply
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}