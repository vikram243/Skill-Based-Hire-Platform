import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import api from "../../lib/axiosSetup";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  PlayCircle,
  Calendar,
  Star,
} from "lucide-react";

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageFade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } },
  };

  const tabContentAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "ease" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const listItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const MotionCard = motion.create(Card);
  const MotionButton = motion.create(Button);
  const MotionTabsContent = motion.create(TabsContent);

  const fetchOrders = async (status) => {
    try {
      const res = await api.get(`/api/orders/status/${status}`);
      setOrders(res.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  React.useEffect(() => {
    fetchOrders(selectedTab);
  }, [selectedTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "ongoing":
        return <PlayCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const OrderCard = ({ order }) => (
    <MotionCard variants={listItem} className="mb-4" initial={false}>
      <CardContent className="p-6">
        {(() => {
          const providerName =
            order.provider?.businessName ||
            order.provider?.user?.fullName ||
            "Unknown";
          const providerAvatar = order.provider?.user?.avatar || "";
          const initials = providerName
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <Avatar className="w-12 h-12 mb-2">
              <AvatarImage src={providerAvatar} alt={providerName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          );
        })()}

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">
                  {order.provider?.businessName ||
                    order.provider?.user?.fullName ||
                    "Unknown"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {order.skill?.name || order.skill || ""}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{order.address?.full || ""}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {order.scheduledTime ||
                    (order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "")}
                </span>
              </div>

              {order.note && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Note: </span>
                  {order.note}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                ₹
                {order.price ||
                  order.pricing?.total ||
                  order.pricing?.serviceRate ||
                  ""}
              </div>

              <div className="flex gap-2">
                {order.status === "pending" && (
                  <>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      Cancel
                    </MotionButton>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </MotionButton>
                  </>
                )}

                {order.status === "accepted" && (
                  <>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </MotionButton>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </MotionButton>
                  </>
                )}

                {order.status === "ongoing" && (
                  <>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      Track Progress
                    </MotionButton>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </MotionButton>
                  </>
                )}

                {order.status === "completed" && (
                  <>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Review
                    </MotionButton>
                    <MotionButton
                      size="sm"
                      variant="outline"
                      whileTap={{ scale: 0.96 }}
                    >
                      Rebook
                    </MotionButton>
                  </>
                )}

                {order.status === "cancelled" && (
                  <MotionButton
                    size="sm"
                    variant="outline"
                    whileTap={{ scale: 0.96 }}
                  >
                    Book Again
                  </MotionButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );

  return (
    <motion.div
      variants={pageFade}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-background pb-20 md:pb-0"
    >
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 1 }}
          transition={{type: "spring", stiffness: 150}}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl! font-bold!">My Orders</h1>
          <Button
            onClick={() => navigate("/search")}
            className="bg-linear-to-r cursor-pointer from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
            variant="outline"
          >
            Book New Service
          </Button>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid-cols md:grid-cols-5 mb-6">
            <TabsTrigger value="pending">
              <span className="text-xs sm:text-sm">Pending</span>
            </TabsTrigger>

            <TabsTrigger value="accepted">
              <span className="text-xs sm:text-sm">Accepted</span>
            </TabsTrigger>

            <TabsTrigger value="ongoing">
              <span className="text-xs sm:text-sm">Ongoing</span>
            </TabsTrigger>

            <TabsTrigger value="completed">
              <span className="text-xs sm:text-sm">Completed</span>
            </TabsTrigger>

            <TabsTrigger value="cancelled">
              <span className="text-xs sm:text-sm">Cancelled</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent
              value={selectedTab}
              className="flex justify-between flex-col md:flex-row gap-6 md:items-center"
            >
              <motion.div
                key={selectedTab}
                variants={tabContentAnim}
                initial="hidden"
                animate="show"
                exit="exit"
                className="space-y-4 w-full"
              >
                {loading ? (
                  <div className="py-24 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Loading Orders...
                    </p>
                  </div>
                ) : orders.orders.length === 0 ? (
                  <Card className="p-8">
                    <div className="text-muted-foreground mb-4 min-h-65 md:min-h-95 flex items-center justify-center">
                      {selectedTab === "pending" && "No pending Orders"}
                      {selectedTab === "accepted" && "No accepted Orders"}
                      {selectedTab === "ongoing" && "No ongoing Orders"}
                      {selectedTab === "completed" && "No completed Orders"}
                      {selectedTab === "cancelled" && "No cancelled Orders"}
                    </div>
                    <Button
                      variant="ghost"
                      className="border-2 border-dashed border-muted"
                      onClick={() => navigate("/search")}
                    >
                      Browse Services
                    </Button>
                  </Card>
                ) : (
                  <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4 w-full"
                  >
                    {orders.orders.map((order) => (
                      <OrderCard key={order._id || order.id} order={order} />
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-2 md:w-[60vw]">
                <MotionCard
                  initial={false}
                  className="py-10 text-center gap-2 shadow-xl"
                >
                  <div className="text-2xl font-bold text-green-500">
                    {orders.completed}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </MotionCard>

                <Card className="py-10 text-center gap-2 shadow-xl">
                  <div className="text-2xl font-bold text-orange-500">
                    {orders.pending}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </Card>

                <Card className="py-10 text-center gap-2 shadow-xl">
                  <div className="text-2xl font-bold text-cyan-500">
                    ₹{orders.totalSpent || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Spent
                  </div>
                </Card>

                <Card className="py-10 text-center gap-2 shadow-xl">
                  <div className="text-2xl font-bold text-yellow-400">4.8</div>
                  <div className="text-sm text-muted-foreground">
                    Avg Rating
                  </div>
                </Card>
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </motion.div>
  );
}
