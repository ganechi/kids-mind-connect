'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Camera } from "lucide-react"
import { children } from "@/constants/children"

const emotionEmojis:any = {
  happy: "😊",
  sad: "😢",
  excited: "😃",
  calm: "😌",
  angry: "😠",
}

const activities = [
  "アート＆クラフト",
  "外遊び",
  "読書タイム",
  "STEMワークショップ",
  "音楽とダンス",
]

const latestAiActivity = {
  time: "11:45",
  activity: "自由遊び",
  aiSummary: "児童たちは協力してブロック遊びをしています。創造性と社会性のスキルが観察されました。",
}

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">本日の概要</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>こどもたちの気持ち</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {children.map((child:any) => (
                <li key={child.name} className="flex items-center justify-between">
                  <span>{child.name}</span>
                  <span className="text-2xl">{emotionEmojis[child.emotion]}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>今日のスケジュール</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            最新のAI活動記録
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">{latestAiActivity.time} - {latestAiActivity.activity}</p>
          <p className="text-sm text-gray-600 mt-2">{latestAiActivity.aiSummary}</p>
        </CardContent>
      </Card>
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertTitle>新しい通知</AlertTitle>
        <AlertDescription>
          AIがリアムの数学における潜在的な学習機会を検出しました。彼のプロフィールの推奨事項をチェックしてください。
        </AlertDescription>
      </Alert>
    </div>
  )
}