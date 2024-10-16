"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const children = [
  { id: 1, name: "はなこ" },
  { id: 2, name: "たろう" },
  { id: 3, name: "みさき" },
  { id: 4, name: "けんた" },
  { id: 5, name: "さくら" },
]

const activities = [
  { type: "緊急", content: "不審者を検知しました。すぐに確認が必要です。", icon: AlertCircle, color: "bg-red-100 text-red-800" },
  { type: "緊急", content: "たくくんが木にぶつかって怪我をしてしまいました。応急処置が必要です。", icon: AlertCircle, color: "bg-red-100 text-red-800" },
  { type: "中", content: "ゆうきくんとあいちゃんがおもちゃの取り合いをしています。仲裁が必要かもしれません。", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800" },
  { type: "中", content: "まなみちゃんが高い場所によじ登ろうとしています。注意が必要です。", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800" },
  { type: "情報", content: "みんなで楽しそうに砂場で遊んでいます。良好な雰囲気です。", icon: Info, color: "bg-blue-100 text-blue-800" },
  { type: "情報", content: "けいたくんが絵本を読んでいます。集中して取り組んでいます。", icon: Info, color: "bg-blue-100 text-blue-800" },
  { type: "気づき", content: "さとしくんが転んだともこちゃんを助けていました。思いやりのある行動です。", icon: Star, color: "bg-green-100 text-green-800" },
  { type: "気づき", content: "りかこちゃんが初めて自分で靴紐を結べました。成長が見られます。", icon: Star, color: "bg-green-100 text-green-800" },
]

export default function CameraMonitoring() {
  const [logs, setLogs] = useState<any>([])
  const [selectedCamera, setSelectedCamera] = useState("カメラ1")
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedImportance, setSelectedImportance] = useState("all")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [currentVideoId, setCurrentVideoId] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      generateAIAnalysis()
    }, 2000) // 5秒ごとに分析を生成

    return () => clearInterval(interval)
  }, [])

  const generateAIAnalysis = () => {
    const randomChild = children[Math.floor(Math.random() * children.length)]
    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    const newLog = {
      id: Date.now(),
      childId: randomChild.id,
      childName: randomChild.name,
      time: new Date().toLocaleTimeString(),
      activity: randomActivity.content,
      type: randomActivity.type,
      icon: randomActivity.icon,
      color: randomActivity.color,
      camera: selectedCamera,
      imageUrl: `/placeholder.svg?height=100&width=100&text=${randomChild.name}の画像`
    }
    setLogs((prevLogs:any) => [newLog, ...prevLogs].slice(0, 50)) // 最新50件のログを保持
  }

  const filteredLogs = logs.filter((log:any) => 
    (selectedChild === "all" || log.childId === parseInt(selectedChild)) &&
    (selectedImportance === "all" || log.type === selectedImportance)
  )

  const handleYoutubeUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = extractYoutubeVideoId(youtubeUrl)
    if (videoId) {
      setCurrentVideoId(videoId)
    } else {
      alert("有効なYouTube URLを入力してください。")
    }
  }

  const extractYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="flex flex-col space-y-6" style={{"height":"700px"}}>
      <h2 className="text-3xl font-bold text-gray-800">AIカメラモニタリング 🤖</h2>
      <div style={{"height":"400px"}} className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <Card className="bg-white shadow-lg flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="mb-4">
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="カメラを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="カメラ1">室内カメラ</SelectItem>
                  <SelectItem value="カメラ2">カメラ2</SelectItem>
                  <SelectItem value="カメラ3">カメラ3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <iframe width="806" height="453" src="https://www.youtube.com/embed/j978dwohzQI?loop=1" ></iframe>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="子どもを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全員</SelectItem>
                  {children.map(child => (
                    <SelectItem key={child.id} value={child.id.toString()}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedImportance} onValueChange={setSelectedImportance}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="重要度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  <SelectItem value="緊急">緊急</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="情報">情報</SelectItem>
                  <SelectItem value="気づき">気づき</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {filteredLogs.map((log:any) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className={`${log.color} border-l-4`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                          </motion.div>
                          <div className="flex-grow">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="flex items-center space-x-2">
                                <log.icon className="w-5 h-5" />
                                <Badge variant="outline">{log.type}</Badge>
                                <p className="font-semibold">{log.time} - {log.childName}</p>
                              </div>
                              <p className="mt-1">{log.activity}</p>
                              <p className="text-sm text-gray-600">カメラ: {log.camera}</p>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}