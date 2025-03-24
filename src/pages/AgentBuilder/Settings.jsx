// import React from 'react'
// import Sidebar from '../../components/SideBar/SideBar'

// const Settings = () => {
//   return (
//     <>
//     <Sidebar />
//     <div className="main-content">
//       <h1 className="placeholder-content">Setting</h1>
//     </div>
//     </>
//   )
// }

// export default Settings

"use client"

import  React from "react"
import { useState } from "react"
import "./Settings.css"
import Sidebar from "../../components/SideBar/SideBar"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: "Jane Creator",
    email: "jane@example.com",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    bio: "DeFi enthusiast and algorithmic trading specialist with 5+ years of experience.",
    darkMode: true,
    notifications: {
      email: true,
      performance: true,
      security: true,
      marketing: false,
    },
    apiKey: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
    twoFactorEnabled: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    // Simulate API call to save profile
    setTimeout(() => {
      alert("Profile saved successfully!")
    }, 500)
  }

  const handleSavePreferences = (e) => {
    e.preventDefault()
    // Simulate API call to save preferences
    setTimeout(() => {
      alert("Preferences saved successfully!")
    }, 500)
  }

  const handleSaveSecurity = (e) => {
    e.preventDefault()
    // Simulate API call to save security settings
    setTimeout(() => {
      alert("Security settings saved successfully!")
    }, 500)
  }

  const handleGenerateNewApiKey = () => {
    // Simulate generating a new API key
    const newApiKey = "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    setFormData((prev) => ({ ...prev, apiKey: newApiKey }))
    alert("New API key generated!")
  }

  const renderProfileTab = () => (
    <form className="settings-form" onSubmit={handleSaveProfile}>
      <div className="form-group">
        <label htmlFor="name">Display Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="walletAddress">Wallet Address</label>
        <input
          type="text"
          id="walletAddress"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
      </div>

      <div className="form-actions">
        <button type="submit" className="gradient-button">
          Save Profile
        </button>
      </div>
    </form>
  )

  const renderPreferencesTab = () => (
    <form className="settings-form" onSubmit={handleSavePreferences}>
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" name="darkMode" checked={formData.darkMode} onChange={handleCheckboxChange} />
          <span>Dark Mode</span>
        </label>
        <p className="form-help">Enable dark mode for a better viewing experience in low-light environments.</p>
      </div>

      <div className="form-section">
        <h3>Notification Preferences</h3>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleCheckboxChange}
            />
            <span>Email Notifications</span>
          </label>
          <p className="form-help">Receive important updates and alerts via email.</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.performance"
              checked={formData.notifications.performance}
              onChange={handleCheckboxChange}
            />
            <span>Performance Alerts</span>
          </label>
          <p className="form-help">Get notified about significant changes in your agents' performance.</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.security"
              checked={formData.notifications.security}
              onChange={handleCheckboxChange}
            />
            <span>Security Alerts</span>
          </label>
          <p className="form-help">Receive notifications about security-related events.</p>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.marketing"
              checked={formData.notifications.marketing}
              onChange={handleCheckboxChange}
            />
            <span>Marketing & Updates</span>
          </label>
          <p className="form-help">Stay informed about new features, products, and promotional offers.</p>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="gradient-button">
          Save Preferences
        </button>
      </div>
    </form>
  )

  const renderSecurityTab = () => (
    <form className="settings-form" onSubmit={handleSaveSecurity}>
      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <div className="api-key-container">
          <input type="text" id="apiKey" name="apiKey" value={formData.apiKey} readOnly />
          <button type="button" className="action-button" onClick={handleGenerateNewApiKey}>
            Generate New
          </button>
        </div>
        <p className="form-help">Your API key provides access to the AIZen API. Keep it secure.</p>
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onChange={handleCheckboxChange}
          />
          <span>Enable Two-Factor Authentication</span>
        </label>
        <p className="form-help">Add an extra layer of security to your account with 2FA.</p>
      </div>

      <div className="form-section">
        <h3>Change Password</h3>

        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input type="password" id="newPassword" name="newPassword" />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="gradient-button">
          Save Security Settings
        </button>
      </div>
    </form>
  )

  return (
    <>
    <Sidebar/>
   
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          {/* <button
            className={`tab-button ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
          <button
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button> */}
        </div>

        <div className="settings-content">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "preferences" && renderPreferencesTab()}
          {activeTab === "security" && renderSecurityTab()}
        </div>
      </div>
    </div>
    </>
  )
}

export default Settings

