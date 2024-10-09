"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Camera, Video, VideoOff, RefreshCw } from "lucide-react"

// AIによる分析をシミュレートする関数
const simulateAIAnalysis = () => {
  const kids = [
    "たかふみくん",
    "たいきくん",
    "たくくん",
    "さくらちゃん",
    "なおあきくん"
  ]
  const activities = [
    "絵を描いています",
    "ブロック遊びをしています",
    "本を読んでいます",
    "友達と会話しています",
    "静かに座っています",
    "喧嘩をしています"
  ]
  const emotions = ["楽しそう", "集中している", "少し退屈そう", "興奮している", "落ち着いている"]
  const randomKids = kids[Math.floor(Math.random() * kids.length)]
  const randomActivity = activities[Math.floor(Math.random() * activities.length)]
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
  return `${randomKids}は${randomActivity}。表情から${randomEmotion}様子が見られます。`
}

export default function CameraMonitoring() {
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [observation, setObservation] = useState("")
  const [isBlurEnabled, setIsBlurEnabled] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setIsCameraOn(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        streamRef.current = stream
        setIsCameraOn(true)
      } catch (err) {
        console.error("カメラの起動に失敗しました:", err)
      }
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // 実際のアプリケーションでは、ここで録画の開始/停止処理を行います
  }

  const handleObservationSubmit = () => {
    console.log("観察記録:", observation)
    // 実際のアプリケーションでは、ここで観察記録をサーバーに送信します
    setObservation("")
  }

  const generateAIAnalysis = () => {
    const analysis = simulateAIAnalysis()
    setAiAnalysis(analysis)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">AIモニタリング</h2>
      <Card>
        <CardHeader>
          <CardTitle>リアルタイム映像</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isBlurEnabled ? 'blur-sm' : ''}`}
            />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">カメラがオフです</p>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <Button onClick={toggleCamera}>
              {isCameraOn ? <VideoOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
              {isCameraOn ? "カメラオフ" : "カメラオン"}
            </Button>
            <Button onClick={toggleRecording} disabled={!isCameraOn}>
              <Video className="mr-2 h-4 w-4" />
              {isRecording ? "録画停止" : "録画開始"}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="blur-mode"
              checked={isBlurEnabled}
              onCheckedChange={setIsBlurEnabled}
            />
            <Label htmlFor="blur-mode">プライバシーモード（顔をぼかす）</Label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI分析と観察記録</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button onClick={generateAIAnalysis} disabled={!isCameraOn}>
              <RefreshCw className="mr-2 h-4 w-4" />
              AI分析を生成
            </Button>
          </div>
          <Textarea
            placeholder="AI分析結果がここに表示されます"
            value={aiAnalysis}
            onChange={(e) => setAiAnalysis(e.target.value)}
            rows={4}
          />
          <Textarea
            placeholder="AIの分析を確認し、必要に応じて編集や追記をしてください"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={4}
          />
          <Button onClick={handleObservationSubmit}>記録を保存</Button>
        </CardContent>
      </Card>
    </div>
  )
}