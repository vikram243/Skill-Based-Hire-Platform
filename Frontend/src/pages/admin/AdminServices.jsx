import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Star, Sparkles, CheckCircle2, Search, Layers, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import api from "../../lib/axiosSetup";
import { toast } from "sonner";

export default function AdminServices() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "⚡",
    category: "Home & Repairs",
    description: "",
    isPopular: false
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/skills/getAllSkills");
      const list = res.data?.data || res.data || [];
      setSkills(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please enter a skill name");
      return;
    }

    try {
      await api.post("/api/skills/createSkill", formData);
      toast.success(`Skill "${formData.name}" created successfully`);
      setIsAddModalOpen(false);
      setFormData({ name: "", icon: "⚡", category: "Home & Repairs", description: "", isPopular: false });
      fetchSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create skill");
    }
  };

  const filtered = skills.filter((s) => {
    const term = searchFilter.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(term) ||
      (s.category || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Service & Skill Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage marketplace skill categories, icons, and featured tags available to providers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSkills}
            className="text-xs h-9 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-9 px-4 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Skill
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 max-w-md">
        <div className="relative flex-1">
          <Input
            placeholder="Search catalog by name or category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-10 text-xs pl-9 pr-3 bg-card border-border rounded-xl"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Skills Table */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Skill Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading skill catalog...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No skills found matching your filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((skill) => (
                    <tr key={skill._id || skill.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-lg">{skill.icon || "⚡"}</td>
                      <td className="py-3 px-4 font-bold text-foreground">{skill.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">
                          {skill.category || "General"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                        {skill.description || "Verified on-demand marketplace trade."}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Skill: ${skill.name}`)}
                          className="text-xs h-7 px-2 text-muted-foreground"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Add New Marketplace Skill</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Skill Title *</label>
                <Input
                  placeholder="e.g. Appliance Repair"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Emoji Icon</label>
                  <Input
                    placeholder="e.g. 🔧, ⚡, 🧹"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="h-10 text-xs text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="Home & Repairs">Home & Repairs</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Tutoring & Lessons">Tutoring & Lessons</option>
                    <option value="Tech & Professional">Tech & Professional</option>
                    <option value="Creative & Media">Creative & Media</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description for search listings..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-4"
                >
                  Save Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
