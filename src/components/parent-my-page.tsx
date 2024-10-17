"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, AlertTriangle, Info, Star, Check, X, Users, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type LogEntry = {
  id: number
  childId: number
  childName: string
  time: string
  activity: string
  type: "緊急" | "中" | "情報" | "気づき"
  icon: typeof AlertCircle | typeof AlertTriangle | typeof Info | typeof Star
  color: string
}

type CommunicationEntry = {
  id: number
  childId?: number
  childName?: string
  time: string
  message: string
  isUrgent: boolean
  isCommon: boolean
}

const children = [
  { id: 1, name: "はなこさん" },
  { id: 2, name: "たろうさん" },
  { id: 3, name: "みさきさん" },
]

const mockLogs: LogEntry[] = [
  {
    id: 1,
    childId: 1,
    childName: "はなこさん",
    time: "10:30",
    activity: "はなこさんは友達と協力して積み木で大きな塔を作りました。チームワークと創造性が素晴らしかったです。",
    type: "気づき",
    icon: Star,
    color: "bg-green-100 text-green-800"
  },
  {
    id: 2,
    childId: 2,
    childName: "たろうさん",
    time: "11:45",
    activity: "たろうさんは給食を完食し、「いただきます」「ごちそうさま」をしっかり言えました。食育の成果が見られます。",
    type: "情報",
    icon: Info,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 3,
    childId: 3,
    childName: "みさきさん",
    time: "13:15",
    activity: "みさきさんは転んでしまい、膝を擦りむきました。消毒して絆創膏を貼りましたが、様子を見てください。",
    type: "中",
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: 4,
    childId: 1,
    childName: "はなこさん",
    time: "14:30",
    activity: "はなこさんは今日初めて自分で靴紐を結ぶことができました。とても嬉しそうでした。",
    type: "気づき",
    icon: Star,
    color: "bg-green-100 text-green-800"
  },
  {
    id: 5,
    childId: 2,
    childName: "たろうさん",
    time: "15:00",
    activity: "たろうさんは今日、少し体調が優れず、お昼寝の時間が長めでした。帰宅後も様子を見てください。",
    type: "中",
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-800"
  },
]

const mockCommunications: CommunicationEntry[] = [
  {
    id: 1,
    childId: 1,
    childName: "はなこさん",
    time: "08:45",
    message: "明日は遠足です。お弁当と水筒をご用意ください。",
    isUrgent: false,
    isCommon: false
  },
  {
    id: 2,
    childId: 2,
    childName: "たろうさん",
    time: "12:30",
    message: "たろうさんが軽い発熱を起こしました。様子を見ていますが、早めのお迎えをお願いする可能性があります。",
    isUrgent: true,
    isCommon: false
  },
  {
    id: 3,
    time: "09:00",
    message: "来週の月曜日は園内清掃のため休園となります。ご了承ください。",
    isUrgent: false,
    isCommon: true
  },
  {
    id: 4,
    time: "15:30",
    message: "インフルエンザが流行しています。手洗い、うがいを徹底してください。",
    isUrgent: true,
    isCommon: true
  }
]

const daysOfWeek = ["月", "火", "水", "木", "金"]

const AttendanceSelector = ({ attendance, setAttendance }: { attendance: boolean[], setAttendance: (newAttendance: boolean[]) => void }) => {
  return (
    <div className="flex justify-between items-center">
      {daysOfWeek.map((day, index) => (
        <div key={day} className="flex flex-col items-center">
          <span className="mb-2">{day}</span>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${attendance[index] ? 'bg-green-100' : 'bg-red-100'}`}
            onClick={() => {
              const newAttendance = [...attendance]
              newAttendance[index] = !newAttendance[index]
              setAttendance(newAttendance)
            }}
          >
            {attendance[index] ? <Check className="h-4 w-4 text-green-700" /> : <X className="h-4 w-4 text-red-700" />}
          </Button>
        </div>
      ))}
    </div>
  )
}

const LineNotification = ({ lastNotificationTime }: { lastNotificationTime: string }) => {
  return (
    <div className="flex items-center justify-end mb-4 text-sm text-gray-600">
      <Bell className="w-4 h-4 mr-2" />
      <span>LINE通知済み: {lastNotificationTime}</span>
    </div>
  )
}

export default function ParentMyPage() {
  const [selectedChild, setSelectedChild] = useState<number>(2) // たろうさんのID
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [filteredCommunications, setFilteredCommunications] = useState<CommunicationEntry[]>([])
  const [attendance, setAttendance] = useState<boolean[]>(Array(5).fill(true))
  const [lastNotificationTime, setLastNotificationTime] = useState<string>("15:45")

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setFilteredLogs(mockLogs.filter(log => log.childId === selectedChild))
    setFilteredCommunications(
      mockCommunications.filter(comm => comm.isCommon || comm.childId === selectedChild)
    )
    // Simulate fetching the last notification time
    setLastNotificationTime(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }))
  }, [selectedChild])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">保護者マイページ</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedChild.toString()} onValueChange={(value) => setSelectedChild(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="お子様を選択" />
            </SelectTrigger>
            <SelectContent>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id.toString()}>{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LineNotification lastNotificationTime={lastNotificationTime} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>今週の出欠</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceSelector attendance={attendance} setAttendance={setAttendance} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>伝達事項</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {filteredCommunications.length > 0 ? (
                  filteredCommunications.map(comm => (
                    <Card key={comm.id} className={`mb-4 ${comm.isUrgent ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">{comm.time}</span>
                            {comm.isCommon && <Users className="w-4 h-4 text-gray-500" />}
                          </div>
                          <div className="flex items-center space-x-2">
                            {comm.isUrgent && <Badge variant="destructive">緊急</Badge>}
                            {comm.isCommon && <Badge variant="secondary">全体</Badge>}
                          </div>
                        </div>
                        <p>{comm.message}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500">伝達事項はありません。</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>活動ログ</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-full w-full rounded-md border p-4">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <Card key={log.id} className={`mb-4 ${log.color}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <log.icon className="w-5 h-5 mr-2" />
                          <span className="font-semibold">{log.time}</span>
                        </div>
                        <Badge variant="outline">{log.type}</Badge>
                      </div>
                      <p>{log.activity}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">今日の活動記録はありません。</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}