"use client";

import { Loader2, LoaderCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/app/auth-context";

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
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your organization&apos;s profile and branding
        </p>
      </div>

      {/* Organization Info */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Organization Info
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="My Community"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              placeholder="info@community.org"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Custom Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.yourorg.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Brand Colors
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-900">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300"
              />
              <span className="font-mono text-sm text-gray-600">
                {primaryColor}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-900">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300"
              />
              <span className="font-mono text-sm text-gray-600">
                {accentColor}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-900">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300"
              />
              <span className="font-mono text-sm text-gray-600">
                {secondaryColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <span className="text-sm text-green-700">Settings saved!</span>
        )}
      </div>
    </div>
  );
}
