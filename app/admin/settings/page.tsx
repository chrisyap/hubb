"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1b5e41");
  const [accentColor, setAccentColor] = useState("#ffc107");
  const [secondaryColor, setSecondaryColor] = useState("#813920");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.orgId) return;
    setLoading(true);
    fetch(`/api/org?orgId=${user.orgId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setOrgName(data.name || "");
        setOrgEmail(data.email || "");
        setDomain(data.domain || "");
        setPrimaryColor(data.primaryColor || "#1b5e41");
        setAccentColor(data.accentColor || "#ffc107");
        setSecondaryColor(data.secondaryColor || "#813920");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.orgId]);

  const handleSave = async () => {
    if (!user?.orgId) return;
    setSaving(true);
    try {
      await fetch("/api/org", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: user.orgId,
          name: orgName,
          email: orgEmail,
          domain,
          primaryColor,
          accentColor,
          secondaryColor,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your organization&apos;s profile and branding
        </p>
      </div>

      {/* Organization Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organization Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="My Community"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgEmail">Email Address</Label>
            <Input
              id="orgEmail"
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              placeholder="info@community.org"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Custom Domain</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.yourorg.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <span className="text-sm font-mono text-muted-foreground">
                  {primaryColor}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <span className="text-sm font-mono text-muted-foreground">
                  {accentColor}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <span className="text-sm font-mono text-muted-foreground">
                  {secondaryColor}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Settings saved!
          </span>
        )}
      </div>
    </div>
  );
}
