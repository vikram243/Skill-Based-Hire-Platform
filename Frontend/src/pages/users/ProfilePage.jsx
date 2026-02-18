import React, { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import ReviewDialog from "../../components/users/ReviewPanel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RegisterProviderPanel from "../../components/users/RegisterProviderPage";
import { profileSchema, firstZodError } from "../../lib/schemas";
import ApplicationStatusPanel from "../../components/users/ApplicationStatusPanel";
import api from "../../lib/axiosSetup";
import { useDispatch } from "react-redux";
import { updateAvatar } from "../../slices/userSlice";
import { updatePersonalInfo } from "../../slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation } from "motion/react";
import {
  MapPin,
  Phone,
  Star,
  Edit,
  LogOut,
  Camera,
  Save,
  X,
  Briefcase,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";

function ProfilePage() {
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [reviewProviderId, setReviewProviderId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegisterProviderOpen, setIsRegisterProviderOpen] = useState(false);
  const [isApplicationStatusOpen, setIsApplicationStatusOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    fistName: user?.firstName || "",
    lastName: user?.lastName || "",
    number: user?.number || "",
    location: user?.location?.address || "",
    bio: user?.bio || "",
  });
  const [orderStats, setOrderStats] = useState(null);
  const [profileError, setProfileError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.firstName) {
      document.title = `${user.firstName} | SkillHub`;
    }
  }, [user?.firstName]);

  const statusColorMap = {
    pending: "bg-yellow-500",
    accepted: "bg-blue-500",
    ongoing: "bg-purple-500",
    completed: "bg-green-600",
    cancelled: "bg-red-500",
    rejected: "bg-gray-500",
  };

  const statusTextMap = {
    pending: "Service request pending",
    accepted: "Service accepted",
    ongoing: "Service in progress",
    completed: "Service completed",
    cancelled: "Service cancelled",
    rejected: "Service rejected",
  };

  const avatarControls = useAnimation();
  const pageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const listItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const avatarVariants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 18,
      },
    },
  };

  const MotionTextarea = motion.create(Textarea);
  const MotionButton = motion.create(Button);

  const stringify = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      if (val.address) return val.address;
      if (val.label) return val.label;
      if (val.source) return val.source;
      try {
        return JSON.stringify(val);
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };

  const displayStats = [
    {
      label: "Total Bookings",
      value: orderStats?.totalOrders?.toString() || "0",
    },
    {
      label: "Active orders",
      value: orderStats?.activeOrders?.toString() || "0",
    },
  ];

  const fetchOrdersStats = async () => {
    try {
      const response = await api.get("/api/orders/stats/me");
      setOrderStats(response.data?.data);
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  useEffect(() => {
    fetchOrdersStats();
  }, []);

  useEffect(() => {
    if (!profileError) return;
    const timer = setTimeout(() => {
      setProfileError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [profileError]);

  const onLogout = async () => {
    try {
      const res = await api.get("/api/users/logout");
      if (res.status === 200) localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSave = async () => {
    setProfileError("");

    const parsed = profileSchema.safeParse({
      firstName: formData.fistName,
      lastName: formData.lastName,
      bio: formData.bio,
    });

    if (!parsed.success) {
      setProfileError(firstZodError(parsed.error));
      return;
    }

    try {
      setSaveLoading(true);

      const res = await api.put("/api/users/update-profile", {
        firstName: formData.fistName,
        lastName: formData.lastName,
        number: formData.number,
        bio: formData.bio,
      });

      if (res.status === 200) {
        dispatch(
          updatePersonalInfo({
            firstName: res?.data?.data?.firstName,
            lastName: res?.data?.data?.lastName,
            fullName: res?.data?.data?.fullName,
            number: res?.data?.data?.number,
            bio: res?.data?.data?.bio,
          }),
        );

        setIsEditing(false);
      }
    } catch (error) {
      setProfileError(
        error?.response?.data?.message || "Profile update failed",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      setAvatarLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.put("/api/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        dispatch(updateAvatar(res?.data?.data?.avatar));
      }
    } catch (error) {
      console.error("Avatar upload failed", error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const timeAgo = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };
  return (
    <AnimatePresence mode="sync">
      <div className="min-h-screen pb-16 bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            <motion.div
              variants={pageVariants}
              initial="hidden"
              animate="show"
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Profile Card */}
              <motion.div variants={cardVariants} className="lg:col-span-1">
                <Card className="p-6 text-center bg-linear-to-br from-card to-(--surface) border-2 border-border/40 shadow-(--shadow-mid)">
                  <div>
                    <div className="relative inline-block mb-4">
                      <motion.div
                        animate={avatarControls}
                        variants={avatarVariants}
                      >
                        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                          <AvatarImage
                            src={user?.avatar}
                            alt={user?.firstName}
                          />
                          <AvatarFallback className="text-xl bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) text-white">
                            {user?.fullName
                              ?.split?.(" ")
                              ?.map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <MotionButton
                        size="sm"
                        disabled={avatarLoading}
                        onMouseEnter={() => avatarControls.start("hover")}
                        onMouseLeave={() => avatarControls.start("rest")}
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-accent hover:bg-accent/90 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {avatarLoading ? (
                          <svg
                            className="animate-spin w-4 h-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </MotionButton>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateProfilePicture(file);
                      }}
                    />

                    <div className="flex flex-col items-center justify-center">
                      <h2 className="text-xl font-bold mb-1 truncate max-w-60">
                        {user?.fullName}
                      </h2>
                      <p className="text-muted-foreground mb-2 truncate max-w-60">
                        {user?.email}
                      </p>

                      <Badge variant="secondary" className="mb-4">
                        {user?.isProvider ? "Service Provider" : "Customer"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm truncate max-w-60">
                          {stringify(user?.location)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm truncate max-w-40">
                          +91 {user?.number}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-2 gap-4">
                      {displayStats.slice(0, 2).map((stat, i) => (
                        <div key={i}>
                          <div className="font-bold text-lg text-(--primary-gradient-start)">
                            {stat.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-2">
                      <MotionButton
                        variant="outline"
                        className="w-full mt-3 bg-linear-to-r cursor-pointer from-(--primary-gradient-start) to-(--primary-gradient-end) hover:opacity-90 text-white"
                        onClick={() => {
                          if (user?.isProvider) {
                            navigate("/provider-dashboard");
                          } else if (user?.isApplicationAttampted) {
                            setIsApplicationStatusOpen(true);
                          } else {
                            setIsRegisterProviderOpen(true);
                          }
                        }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.1 }}
                      >
                        {user?.isProvider
                          ? "Go to Provider Dashboard"
                          : user?.isApplicationAttampted
                            ? "Check Application Status"
                            : "Become Provider"}
                      </MotionButton>

                      <MotionButton
                        variant="outline"
                        className="w-full cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={onLogout}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.1 }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </MotionButton>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Main Content */}
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList className="grid w-full h-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="personal"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <Card className="p-6">
                          <motion.div
                            className="flex items-center justify-between mb-6"
                            animate={
                              isEditing
                                ? { opacity: 1, scale: 1 }
                                : { opacity: 0.98, scale: 0.995 }
                            }
                            transition={{ duration: 0.18 }}
                          >
                            <h3 className="text-lg font-semibold">
                              Personal Information
                            </h3>
                            {!isEditing ? (
                              <MotionButton
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                whileTap={{ scale: 0.96 }}
                                transition={{ duration: 0.1 }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </MotionButton>
                            ) : (
                              <div className="flex gap-2">
                                <MotionButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsEditing(false)}
                                  whileTap={{ scale: 0.96 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </MotionButton>
                                <MotionButton
                                  size="sm"
                                  disabled={saveLoading}
                                  onClick={handleSave}
                                  className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                                  whileTap={{ scale: 0.96 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  {saveLoading ? (
                                    <svg
                                      className="animate-spin w-4 h-4"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                      />
                                    </svg>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4 mr-2" />
                                      Save
                                    </>
                                  )}
                                </MotionButton>
                              </div>
                            )}
                          </motion.div>

                          {profileError && (
                            <div className="text-sm text-red-600">
                              {profileError}
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="flex gap-1 flex-col">
                                <Label>First Name</Label>
                                <motion.div
                                  whileFocusWithin={{ scale: 1.01 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    id="firstName"
                                    value={formData.fistName}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        fistName: e.target.value,
                                      }))
                                    }
                                    disabled={!isEditing}
                                  />
                                </motion.div>
                              </div>
                              <div className="flex gap-1 flex-col">
                                <Label>Last Name</Label>
                                <motion.div
                                  whileFocusWithin={{ scale: 1.01 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        lastName: e.target.value,
                                      }))
                                    }
                                    disabled={!isEditing}
                                  />
                                </motion.div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="flex gap-1 flex-col">
                                <Label>Phone</Label>
                                <Input
                                  id="phone"
                                  value={formData.number}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      number: e.target.value,
                                    }))
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="flex gap-1 flex-col">
                                <Label>Email</Label>
                                <Input
                                  id="email"
                                  value={user?.email}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      email: e.target.value,
                                    }))
                                  }
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="flex gap-1 flex-col">
                              <Label>Address</Label>
                              <Textarea
                                id="location"
                                value={formData?.location}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    location: e.target.value,
                                  }))
                                }
                                disabled
                                rows={2}
                              />
                            </div>

                            <div className="flex gap-1 flex-col">
                              <Label>Bio</Label>
                              <motion.div
                                whileFocusWithin={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <MotionTextarea
                                  id="bio"
                                  value={formData.bio}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      bio: e.target.value,
                                    }))
                                  }
                                  disabled={!isEditing}
                                  rows={2}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="activity">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold">
                            Recent Activity
                          </h3>
                          <motion.div
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                          >
                            {(!orderStats?.recentOrders ||
                              orderStats.recentOrders.length === 0) && (
                              <div className="text-sm text-muted-foreground text-center pb-10">
                                No recent activity
                              </div>
                            )}
                            {orderStats?.recentOrders?.map(
                              (activity, index) => (
                                <motion.div
                                  key={index}
                                  variants={listItem}
                                  className="flex items-center justify-between p-4 rounded-lg bg-(--surface) border border-border/40"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        statusColorMap[activity?.orderStatus] ||
                                        "bg-gray-400"
                                      }`}
                                    />
                                    <div>
                                      <p className="font-medium">
                                        {activity?.skill?.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {statusTextMap[activity?.orderStatus] ||
                                          "Service updated"}{" "}
                                        • {timeAgo(activity?.createdAt)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <Star
                                      className="w-4 h-4 cursor-pointer fill-yellow-400 text-yellow-400"
                                      onClick={() => {
                                        (setIsReviewPanelOpen(true),
                                          setReviewProviderId(
                                            activity?.provider,
                                          ),
                                          setSelectedOrderId(activity?._id));
                                      }}
                                    />
                                  </div>
                                </motion.div>
                              ),
                            )}
                          </motion.div>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="settings">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold mb-6">
                            Account Settings
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <h4 className="font-medium">Notifications</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>Email notifications</span>
                                  <Switch
                                    defaultChecked
                                    className="border border-border"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>SMS notifications</span>
                                  <Switch
                                    defaultChecked
                                    className="border border-border"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Marketing emails</span>
                                  <Switch className="border border-border" />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                              <h4 className="font-medium">Privacy</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span>Profile visibility</span>
                                  <Badge variant="secondary">Public</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Show location</span>
                                  <Switch
                                    defaultChecked
                                    className="border border-border"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <RegisterProviderPanel
          isOpen={isRegisterProviderOpen}
          onClose={() => setIsRegisterProviderOpen(false)}
          onSuccess={() => {
            setIsRegisterProviderOpen(false);
          }}
          number={user?.number}
        />

        <ApplicationStatusPanel
          isOpen={isApplicationStatusOpen}
          onClose={() => setIsApplicationStatusOpen(false)}
        />

        <ReviewDialog
          isOpen={isReviewPanelOpen}
          reviewProviderId={reviewProviderId}
          orderId={selectedOrderId}
          onClose={() => setIsReviewPanelOpen(false)}
        />
      </div>
    </AnimatePresence>
  );
}

export default ProfilePage;
