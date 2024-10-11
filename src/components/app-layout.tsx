"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, BarChart2, Settings, Users, Calendar, Camera, Menu, X, MessageSquare, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Dashboard from "./dashboard"
import ChildProfiles from "./child-profiles"
import ActivityLog from "./activity-log"
import Reports from "./reports"
import SettingsPanel from "./settings"
import CameraMonitoring from "./camera-monitoring"
import StaffNotes from "./staff-notes"
import ParentNotifications from "./parent-notifications"

const menuItems = [
  { icon: Bell, label: "ダッシュボード", value: "dashboard", color: "bg-pink-200" },
  { icon: Users, label: "児童プロフィール", value: "child-profiles", color: "bg-purple-200" },
  { icon: Calendar, label: "活動ログ", value: "activity-log", color: "bg-blue-200" },
  { icon: Camera, label: "カメラモニタリング", value: "camera-monitoring", color: "bg-green-200" },
  { icon: BarChart2, label: "レポート", value: "reports", color: "bg-yellow-200" },
  { icon: MessageSquare, label: "スタッフノート", value: "staff-notes", color: "bg-indigo-200" },
  { icon: AlertTriangle, label: "保護者通知", value: "parent-notifications", color: "bg-orange-200" },
  { icon: Settings, label: "設定", value: "settings", color: "bg-red-200" },
]

const staffMembers = [
  { id: 1, name: "佐藤 美咲" },
  { id: 2, name: "田中 健太" },
  { id: 3, name: "鈴木 優子" },
  { id: 4, name: "高橋 誠" },
]

export function AppLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(staffMembers[0].id.toString())

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
        <header className="bg-pink-100 p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Kids Mind Connect</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-600">さくら学童クラブ</p>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="スタッフを選択" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map(staff => (
                  <SelectItem key={staff.id} value={staff.id.toString()}>{staff.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <AnimatePresence>
            <motion.nav
              initial={{ width: 0 }}
              animate={{ width: isMenuOpen ? "auto" : "64px" }}
              exit={{ width: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-blue-50 p-2 flex flex-col items-center"
            >
              <button onClick={toggleMenu} className="mb-4 p-2 rounded-full hover:bg-blue-100">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <TooltipProvider key={item.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <button
                            onClick={() => setActiveTab(item.value)}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              activeTab === item.value
                                ? `${item.color} text-gray-800`
                                : "hover:bg-blue-100"
                            }`}
                          >
                            <item.icon size={24} />
                            {isMenuOpen && <span className="ml-2">{item.label}</span>}
                          </button>
                        </motion.li>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </ul>
            </motion.nav>
          </AnimatePresence>
          <main className="flex-1 overflow-auto p-4">
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