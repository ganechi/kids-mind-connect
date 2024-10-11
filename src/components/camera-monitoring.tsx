"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Star } from "lucide-react"
import { children } from "@/constants/children"

const activities = [
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
  const videoRef = useRef<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      generateAIAnalysis()
    }, 3000) // 3秒ごとに分析を生成

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(err => {
          console.error("カメラへのアクセスエラー:", err)
        })
    }
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

  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">AIカメラモニタリング</h2>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <Card className="bg-white shadow-lg flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="mb-4">
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="カメラを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="カメラ1">カメラ1</SelectItem>
                  <SelectItem value="カメラ2">カメラ2</SelectItem>
                  <SelectItem value="カメラ3">カメラ3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
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
            <div className="flex-1 space-y-4 overflow-y-auto">
              {filteredLogs.map((log:any) => (
                <Card key={log.id} className={`${log.color} border-l-4`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <log.icon className="w-5 h-5" />
                          <Badge variant="outline">{log.type}</Badge>
                          <p className="font-semibold">{log.time} - {log.childName}</p>
                        </div>
                        <p className="mt-1">{log.activity}</p>
                        <p className="text-sm text-gray-600">カメラ: {log.camera}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}