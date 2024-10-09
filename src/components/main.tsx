"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, BarChart2, Settings, Users, Calendar, Camera, Menu, X, MessageSquare, AlertTriangle } from "lucide-react"
import Dashboard from "./dashboard"
import ChildProfiles from "./child-profiles"
import ActivityLog from "./activity-log"
import SettingsPanel from "./settings"
import CameraMonitoring from "./camera-monitoring"
import StaffNotes from "./staff-notes"
import Reports from "./reports"
import ParentNotifications from "./parent-notifications"

const menuItems = [
  { icon: Bell, label: "ダッシュボード", value: "dashboard", color: "bg-pink-500" },
  { icon: Users, label: "こどもリスト", value: "child-profiles", color: "bg-purple-500" },
  { icon: Calendar, label: "AI活動ログ", value: "activity-log", color: "bg-blue-500" },
  { icon: Camera, label: "AIモニタリング", value: "camera-monitoring", color: "bg-green-500" },
  { icon: BarChart2, label: "AIレポート", value: "reports", color: "bg-yellow-500" },
  { icon: MessageSquare, label: "スタッフノート", value: "staff-notes", color: "bg-indigo-500" },
  { icon: AlertTriangle, label: "保護者通知", value: "parent-notifications", color: "bg-orange-500" },
  { icon: Settings, label: "設定", value: "settings", color: "bg-red-500" },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-white p-4 md:p-6 border-b flex justify-between items-center">
        <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-3xl font-bold text-blue-600">KidsMindConnect</h1>
          <div className="relative mt-2 invisible md:visible">
            <button type="button" className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
              <span className="flex items-center">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWmX7QY-HZMc2pj01KPxjvVQydjsGm0OCRRlDXWZDysJi71ixlv9mgJHbSIPVsMXhuE9SEemrO5EMke340xbgufZfx9j6t3f0KV3pH5d9mK7ZmO-8_3xNgA_3i38bPIQJBTPQMciJGHcg/s800/icon_business_woman04.png" alt="" className="h-5 w-5 flex-shrink-0 rounded-full"/>
                <span className="ml-3 block truncate">大鐘さん</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                  <path fill-rule="evenodd" d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z" clip-rule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
        </header>
        <div className="flex flex-col md:flex-row">
          <AnimatePresence>
              <motion.nav
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`w-full md:w-64 bg-gray-100 p-4 ${isMenuOpen ? 'block' : 'hidden md:block'}`}
              >
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <motion.li key={item.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => {
                          setActiveTab(item.value)
                          setIsMenuOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                          activeTab === item.value
                            ? `${item.color} text-white`
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
          </AnimatePresence>
          <main className="flex-grow p-4 md:p-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "child-profiles" && <ChildProfiles />}
            {activeTab === "activity-log" && <ActivityLog />}
            {activeTab === "camera-monitoring" && <CameraMonitoring />}
            {activeTab === "reports" && <Reports />}
            {activeTab === "staff-notes" && <StaffNotes />}
            {activeTab === "parent-notifications" && <ParentNotifications />}
            {activeTab === "settings" && <SettingsPanel />}
          </main>
        </div>
      </div>
    </div>
  )
}