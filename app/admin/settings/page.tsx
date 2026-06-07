"use client";

import { Loader2, LoaderCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/app/auth-context";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { PageTitle } from "@/app/components/ui/pageTitle";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={48} className="animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8">
        <PageTitle
          title="Settings"
          description="Configure your organization's profile and branding"
        />
      </div>

      {/* Organization Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organization Info</CardTitle>
          <CardDescription>
            Configure your organization&apos;s profile and branding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization Name
              </label>
              <Input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="My Community"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                placeholder="info@community.org"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Domain
              </label>
              <Input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="www.yourorg.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>
            Customize the primary, accent, and secondary colors for your
            organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-300">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-xs border border-gray-300 dark:border-gray-600"
                />
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                  {primaryColor}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-300">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-xs border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                  {accentColor}
                </span>
              </div>
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-300">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-xs border border-gray-300 dark:border-gray-600"
                />
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
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
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <span className="text-sm text-green-700">Settings saved!</span>
        )}
      </div>
    </div>
  );
}
