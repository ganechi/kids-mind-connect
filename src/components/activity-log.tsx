'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Camera } from "lucide-react"

const initialActivities = [
  {
    id: 1,
    time: "09:00",
    activity: "朝の集会",
    description: "今日の天気と予定についてのグループディスカッション。",
    aiSummary: "子どもたちは今後のアートプロジェクトに熱心でした。リアムは雲について学ぶことに興味を示しました。",
  },
  {
    id: 2,
    time: "10:30",
    activity: "アートプロジェクト：絵画",
    description: "子どもたちは好きな動物をテーマに作品を制作しました。",
    aiSummary: "エマは非常に創造性を発揮し、ノアは参加するのに少し励ましが必要でした。",
  },
]

export default function ActivityLog() {
  const [activities, setActivities] = useState(initialActivities)
  const [newActivity, setNewActivity] = useState("")
  const [aiGeneratedActivities, setAiGeneratedActivities] = useState<any>([])

  useEffect(() => {
    // 実際のアプリケーションでは、ここでサーバーからAI生成された活動を取得します
    const mockAiActivities = [
      {
        id: 3,
        time: "11:45",
        activity: "自由遊び",
        description: "カメラモニタリングによる自動記録",
        aiSummary: "児童たちは協力してブロック遊びをしています。創造性と社会性のスキルが観察されました。",
      },
    ]
    setAiGeneratedActivities(mockAiActivities)
  }, [])

  const handleAddActivity = () => {
    const newActivityItem = {
      id: activities.length + aiGeneratedActivities.length + 1,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      activity: "手動入力",
      description: newActivity,
      aiSummary: "",
    }
    setActivities([...activities, newActivityItem])
    setNewActivity("")
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">AI活動ログ</h2>
      <Card>
        <CardHeader>
          <CardTitle>新しい活動を追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="活動の詳細を入力..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
            />
            <Button onClick={handleAddActivity}>
              <Send className="w-4 h-4 mr-2" />
              追加
            </Button>
          </div>
          <Button variant="outline">
            <Mic className="w-4 h-4 mr-2" />
            音声入力
          </Button>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {[...activities, ...aiGeneratedActivities].sort((a, b) => a.id - b.id).map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                {activity.time} - {activity.activity}
                {activity.activity.startsWith('AI生成') && (
                  <Camera className="w-4 h-4 ml-2 text-blue-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{activity.description}</p>
              {activity.aiSummary && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="font-semibold text-blue-800">AI要約</h4>
                  <p className="text-sm text-blue-600">{activity.aiSummary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}