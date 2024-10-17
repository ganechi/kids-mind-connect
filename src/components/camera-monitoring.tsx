"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

const initialCameras = [
  { id: 1, name: "カメラ1", type: "webcam", source: null },
  { id: 2, name: "カメラ2", type: "webcam", source: null },
  { id: 3, name: "カメラ3", type: "webcam", source: null },
  { id: 4, name: "カメラ4", type: "webcam", source: null },
]

interface Log {
  id: number;
  childId: number;
  childName: string;
  time: string;
  activity: string;
  type: string;
  icon: React.ComponentType;
  color: string;
  camera: string;
  imageUrl: string;
}

import { Edit } from "lucide-react"

export default function CameraMonitoring() {
  const [logs, setLogs] = useState<Log[]>([])
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedImportance, setSelectedImportance] = useState("all")
  const [cameras, setCameras] = useState(initialCameras)
  const [availableWebcams, setAvailableWebcams] = useState<MediaDeviceInfo[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(cameras.map(() => null))

  useEffect(() => {
    const interval = setInterval(() => {
      generateAIAnalysis()
    }, 3000) // 3秒ごとに分析を生成

    // Get available webcams
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setAvailableWebcams(videoDevices)
      })
      .catch(err => {
        console.error("デバイスの列挙中にエラーが発生しました:", err)
      })

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    cameras.forEach((camera, index) => {
      if (camera.type === "webcam" && camera.source) {
        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: camera.source } } })
          .then(stream => {
            const videoElement = videoRefs.current[index]
            if (videoElement) {
              videoElement.srcObject = stream
              videoElement.play().catch(err => console.error("ビデオの再生中にエラーが発生しました:", err))
            }
          })
          .catch(err => console.error("Webカメラへのアクセス中にエラーが発生しました:", err))
      }
    })

    return () => {
      cameras.forEach((camera, index) => {
        const videoElement = videoRefs.current[index]
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream
          stream.getTracks().forEach(track => track.stop())
        }
      })
    }
  }, [cameras])

  const generateAIAnalysis = () => {
    const randomChild = children[Math.floor(Math.random() * children.length)]
    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)]
    const newLog = {
      id: Date.now(),
      childId: randomChild.id,
      childName: randomChild.name,
      time: new Date().toLocaleTimeString(),
      activity: randomActivity.content,
      type: randomActivity.type,
      icon: randomActivity.icon,
      color: randomActivity.color,
      camera: randomCamera.name,
      imageUrl: `/placeholder.svg?height=100&width=100&text=${randomChild.name}の画像`
    }
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 50)) // 最新50件のログを保持
  }

  const filteredLogs = logs.filter(log => 
    (selectedChild === "all" || log.childId === parseInt(selectedChild)) &&
    (selectedImportance === "all" || log.type === selectedImportance)
  )

  const updateCamera = (id: number, newData: any) => {
    setCameras((prevCameras: any[]) => 
      prevCameras.map((camera: any) => {
        if (camera.id === id) {
          const updatedCamera = { ...camera, ...newData };
          if (updatedCamera.type === "webcam" && updatedCamera.source === "no-webcams") {
            updatedCamera.source = null;
          }
          return updatedCamera;
        }
        return camera;
      })
    )
  }

  const extractYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">カメラモニタリング</h2>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <Card className="bg-white shadow-lg flex flex-col max-h-[500px]">
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {cameras.map((camera, index) => (
                <Dialog key={camera.id}>
                  <DialogTrigger asChild>
                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer group">
                      {camera.type === "youtube" && camera.source ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${camera.source}`}
                          title={`${camera.name} YouTube Video`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      ) : camera.type === "webcam" && camera.source ? (
                        <video
                          ref={(el: HTMLVideoElement | null) => {
                            if (el) {
                              videoRefs.current[index] = el;
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          {camera.name}
                        </div>
                      )}
                      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-center">
                        <span className="text-white font-semibold">{camera.name}</span>
                        <Edit className="text-white w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{camera.name}の設定</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                          カメラ名
                        </label>
                        <Input
                          id="name"
                          value={camera.name}
                          onChange={(e) => updateCamera(camera.id, { name: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="type" className="text-right">
                          タイプ
                        </label>
                        <Select
                          value={camera.type}
                          onValueChange={(value) => updateCamera(camera.id, { type: value, source: null })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="タイプを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="webcam">Webカメラ</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {camera.type === "webcam" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="webcam" className="text-right">
                            Webカメラ
                          </label>
                          <Select
                            value={camera.source || (availableWebcams.length > 0 ? availableWebcams[0].deviceId : "no-webcams")}
                            onValueChange={(value) => updateCamera(camera.id, { source: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Webカメラを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableWebcams.length > 0 ? (
                                availableWebcams.map((webcam) => (
                                  <SelectItem key={webcam.deviceId} value={webcam.deviceId || 'default'}>
                                    {webcam.label || `Webカメラ ${webcam.deviceId.slice(0, 5)}`}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-webcams">利用可能なWebカメラがありません</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {camera.type === "youtube" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="youtube" className="text-right">
                            YouTube URL
                          </label>
                          <Input
                            id="youtube"
                            placeholder="https://www.youtube.com/watch?v=..."
                            onChange={(e) => {
                              const videoId = extractYoutubeVideoId(e.target.value)
                              if (videoId) {
                                updateCamera(camera.id, { source: videoId })
                              }
                            }}
                            className="col-span-3"
                          />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg flex flex-col max-h-[700px]">
          <CardContent className="flex-1 flex flex-col p-4 max-h-[700px] overflow-y-auto">
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
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredLogs.map((log) => (
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
                          {/* <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Image
                              src={log.imageUrl}
                              alt={`${log.childName}の画像`}
                              width={100}
                              height={100}
                              className="rounded-md"
                            />
                          </motion.div> */}
                          <div className="flex-grow">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="flex items-center space-x-2">
                                {log.icon && <log.icon />}
                                <Badge variant="outline">{log.type}</Badge>
                                <p className="font-semibold">{log.time} - {log.childName}</p>
                              </div>
                              <p className="mt-1">{log.activity}</p>
                              <p className="text-sm  text-gray-600">カメラ: {log.camera}</p>
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
