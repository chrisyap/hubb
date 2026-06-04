"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Lindfield East P&C")
  const [orgEmail, setOrgEmail] = useState("info@lepspandc.asn.au")
  const [domain, setDomain] = useState("lepspandc.asn.au")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your organization's profile and branding</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization Info</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Custom Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.yourorg.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Brand Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#15803d"
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <span className="text-sm text-gray-600">#15803d</span>
            </div>
            <div className="mt-3 p-4 bg-green-700 rounded-lg text-white text-center text-sm font-medium">
              Preview
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#f59e0b"
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <span className="text-sm text-gray-600">#f59e0b</span>
            </div>
            <div className="mt-3 p-4 bg-amber-400 rounded-lg text-white text-center text-sm font-medium">
              Preview
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#6b7280"
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
              />
              <span className="text-sm text-gray-600">#6b7280</span>
            </div>
            <div className="mt-3 p-4 bg-gray-500 rounded-lg text-white text-center text-sm font-medium">
              Preview
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
      >
        <Save size={20} />
        {saved ? "Settings Saved!" : "Save Settings"}
      </button>
    </div>
  )
}
