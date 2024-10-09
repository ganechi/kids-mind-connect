'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Camera } from "lucide-react"
import { initialActivities } from "@/constants/activites"

export default function ActivityLog() {
  const [activities, setActivities] = useState(initialActivities)
  const [newActivity, setNewActivity] = useState("")

  const handleAddActivity = () => {
    const newActivityItem = {
      id: activities.length + 1,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      activity: "手動入力",
      description: newActivity,
      aiSummary: "",
      camera: false,
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
        {activities.sort((a, b) => b.id - a.id).map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                {activity.time} - {activity.activity}
                {activity.camera && (
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