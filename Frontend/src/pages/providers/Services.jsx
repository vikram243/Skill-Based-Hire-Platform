import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, DollarSign, Clock, Tag, Sparkles, Layers } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import api from "../../lib/axiosSetup";
import { toast } from "sonner";

export default function ProviderServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Electrical",
    pricingModel: "hourly",
    rate: 65,
    durationMin: 60,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/providers/profile");
        const prov = res.data?.data || {};
        
        // Initial service from provider's primary trade
        const initial = [
          {
            id: "primary-1",
            title: prov.businessName || "Primary Trade Service",
            category: prov.skill?.name || "General Maintenance",
            pricingModel: prov.pricing?.rateType || "hourly",
            rate: prov.pricing?.serviceRate || 55,
            durationMin: 60,
            description: prov.professionalDescription || "Standard trade call and diagnostics.",
            isActive: true,
          }
        ];
        setServices(initial);
      } catch (err) {
        // Fallback demo service
        setServices([
          {
            id: "s-1",
            title: "Standard Diagnostics & Inspection",
            category: "General",
            pricingModel: "hourly",
            rate: 60,
            durationMin: 60,
            description: "On-site assessment, inspection, and initial repair estimate.",
            isActive: true,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      category: "Maintenance",
      pricingModel: "hourly",
      rate: 65,
      durationMin: 60,
      description: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({ ...svc });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service package removed");
  };

  const handleToggleActive = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.info("Service visibility updated");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.rate) {
      toast.error("Please enter a title and rate");
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...formData, id: s.id } : s))
      );
      toast.success("Service updated successfully");
    } else {
      const newSvc = {
        ...formData,
        id: `svc-${Date.now()}`
      };
      setServices((prev) => [...prev, newSvc]);
      toast.success("New service package created");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Manage Service Offerings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure your billable service packages, hourly pricing, and availability.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-10 px-4 text-xs shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Service Package
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Card key={svc.id} className="border-border bg-card shadow-sm flex flex-col justify-between overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <Badge variant="outline" className="text-xs font-semibold">
                  {svc.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {svc.isActive ? "Active" : "Paused"}
                  </span>
                  <Switch
                    checked={svc.isActive}
                    onCheckedChange={() => handleToggleActive(svc.id)}
                    className="scale-75"
                  />
                </div>
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2">
                {svc.title}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {svc.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="flex items-baseline justify-between p-3 rounded-xl bg-secondary/40 border border-border/50 text-xs font-semibold">
                <span className="text-muted-foreground">Rate:</span>
                <span className="text-base font-extrabold text-foreground">
                  ${svc.rate} <span className="text-xs font-normal text-muted-foreground">/{svc.pricingModel}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  ~{svc.durationMin} mins
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Instant Escrow
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(svc)}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(svc.id)}
                  className="h-8 px-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal / Dialog for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingService ? "Edit Service Package" : "Create New Service Package"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Package Title *</label>
                <Input
                  placeholder="e.g. Panel Inspection & Outlet Diagnostic"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Pricing Model</label>
                  <select
                    value={formData.pricingModel}
                    onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="hourly">Hourly Rate</option>
                    <option value="perJob">Fixed / Per Job</option>
                    <option value="daily">Daily Rate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Rate ($) *</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                    required
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain what is included in this service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90 text-xs font-bold h-9 px-4"
                >
                  Save Package
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
