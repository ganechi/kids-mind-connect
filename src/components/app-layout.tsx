"use client"

import { useState, useEffect } from "react"
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

interface BubbleProps {
  size: number;
  position: { x: string; y: string };
  delay: number;
}

const Bubble: React.FC<BubbleProps> = ({ size, position, delay }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white opacity-30"
      style={{
        width: size,
        height: size,
        left: position.x,
      }}
      initial={{ bottom: "-100px", scale: 0 }}
      animate={{
        bottom: "100vh",
        scale: [0, 1.2, 0],
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: 8,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 10 + 5,
      }}
    />
  )
}

const BubbleBackground: React.FC = () => {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 50 + 10,
    position: {
      x: `${Math.random() * 100}%`,
      y: "0%",
    },
    delay: Math.random() * 10,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} size={bubble.size} position={bubble.position} delay={bubble.delay} />
      ))}
    </div>
  )
}

export function AppLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(staffMembers[0].id.toString())

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col relative overflow-hidden">
      <BubbleBackground />
      <header className="bg-pink-100 bg-opacity-80 p-4 border-b flex justify-between items-center relative z-10">
        <h1 className="text-2xl font-bold text-pink-600">キッズマインド コネクト</h1>
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
      <div className="flex flex-1 overflow-hidden relative z-10">
        <AnimatePresence>
          <motion.nav
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            exit={{ width: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-blue-50 bg-opacity-80 p-2 flex flex-col items-center"
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
        <main className="flex-1 overflow-auto p-4 bg-white bg-opacity-50 rounded-lg m-2 relative z-10">
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
  )
}