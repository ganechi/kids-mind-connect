"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle } from "lucide-react"

const initialParentNotifications = [
  { id: 1, title: "持ち物のお知らせ", content: "明日は遠足です。お弁当と水筒をお忘れなく。" },
  { id: 2, title: "健康診断のお知らせ", content: "来週の水曜日に定期健康診断を実施します。" },
]

export default function ParentNotifications() {
  const [parentNotifications, setParentNotifications] = useState(initialParentNotifications)
  const [newNotification, setNewNotification] = useState({ title: "", content: "" })

  const addParentNotification = () => {
    if (newNotification.title.trim() && newNotification.content.trim()) {
      setParentNotifications([...parentNotifications, { id: Date.now(), ...newNotification }])
      setNewNotification({ title: "", content: "" })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">保護者向けお知らせ</h2>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-700">
            <AlertTriangle className="w-5 h-5 mr-2" />
            保護者向け重要なお知らせ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parentNotifications.map((notification) => (
            <Alert key={notification.id} className="bg-white">
              <AlertTitle>{notification.title}</AlertTitle>
              <AlertDescription>{notification.content}</AlertDescription>
            </Alert>
          ))}
          <div className="space-y-2">
            <Input
              placeholder="タイトル"
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
            />
            <Textarea
              placeholder="お知らせ内容"
              value={newNotification.content}
              onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
            />
            <Button onClick={addParentNotification}>お知らせを追加</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}