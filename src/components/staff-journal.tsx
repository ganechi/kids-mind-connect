"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, AlertTriangle, Info, Star } from "lucide-react"
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "@/components/ui/table"

const children = [
  { id: 1, name: "はなこ" },
  { id: 2, name: "たろう" },
  { id: 3, name: "みさき" },
  { id: 4, name: "けんた" },
  { id: 5, name: "さくら" },
  { id: 6, name: "ゆうた" },
  { id: 7, name: "あやか" },
  { id: 8, name: "りょう" },
]

const activities = [
  { id: 1, name: "朝の会", time: "09:00 - 09:15" },
  { id: 2, name: "自由遊び", time: "09:15 - 10:30" },
  { id: 3, name: "おやつ時間", time: "10:30 - 11:00" },
  { id: 4, name: "学習時間", time: "11:00 - 12:00" },
  { id: 5, name: "昼食", time: "12:00 - 13:00" },
]

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

const ChildRow = ({ child, aiSummaries, childrenLogs }: { child: { id: number; name: string }, aiSummaries: { [key: number]: string }, childrenLogs: { [key: number]: LogEntry[] } }) => {
  return (
    <TableRow className="group relative">
      <TableCell className="font-medium">{child.name}</TableCell>
      <TableCell>{aiSummaries[child.id]}</TableCell>
      <div className="absolute left-full top-0 ml-2 w-64 bg-white p-4 rounded-md shadow-lg invisible group-hover:visible transition-all duration-300 z-10">
        <h4 className="font-semibold mb-2">{child.name}の活動ログ</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {childrenLogs[child.id]?.map(log => (
            <div key={log.id} className={`p-2 rounded-lg ${log.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <log.icon className="w-4 h-4" />
                <span className="text-xs font-semibold">{log.time}</span>
              </div>
              <p className="text-sm">{log.activity}</p>
            </div>
          ))}
        </div>
      </div>
    </TableRow>
  )
}


export default function StaffJournal() {
  const [childrenLogs, setChildrenLogs] = useState<{ [key: number]: LogEntry[] }>({})
  const [activityLogs, setActivityLogs] = useState<{ [key: number]: string }>({})
  const [aiSummaries, setAiSummaries] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    // Simulate fetching logs from AI camera monitoring
    const generateMockLogs = () => {
      const newChildrenLogs: { [key: number]: LogEntry[] } = {}
      const newAiSummaries: { [key: number]: string } = {}
      const newActivityLogs: { [key: number]: string } = {}
      children.forEach(child => {
        newChildrenLogs[child.id] = Array(5).fill(null).map((_, index) => ({
          id: Date.now() + index,
          childId: child.id,
          childName: child.name,
          time: new Date().toLocaleTimeString(),
          activity: `${child.name}は${["元気に遊んでいます", "友達と協力しています", "集中して学習しています", "楽しそうに食事をしています", "静かに休憩しています"][Math.floor(Math.random() * 5)]}`,
          type: ["緊急", "中", "情報", "気づき"][Math.floor(Math.random() * 4)] as "緊急" | "中" | "情報" | "気づき",
          icon: [AlertCircle, AlertTriangle, Info, Star][Math.floor(Math.random() * 4)],
          color: ["bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800", "bg-blue-100 text-blue-800", "bg-green-100 text-green-800"][Math.floor(Math.random() * 4)]
        }))
        newAiSummaries[child.id] = `${child.name}は今日、全体的に${["元気", "協調的", "集中力がある", "楽しそう", "落ち着いた"][Math.floor(Math.random() * 5)]}様子でした。特に${["自由遊びの時間に積極的に友達と関わる", "学習時間に集中して取り組む", "昼食を楽しそうに食べる", "他の子の手伝いをする"][Math.floor(Math.random() * 4)]}姿が見られました。`
      })
      activities.forEach(activity => {
        newActivityLogs[activity.id] = `${activity.name}では、子どもたちは${["積極的に参加し", "楽しそうに活動し", "協力して取り組み", "集中して取り組み"][Math.floor(Math.random() * 4)]}ました。特に${["グループ活動での協調性", "個々の創造性", "学習意欲", "コミュニケーション能力"][Math.floor(Math.random() * 4)]}が見られました。`
      })
      setChildrenLogs(newChildrenLogs)
      setAiSummaries(newAiSummaries)
      setActivityLogs(newActivityLogs)
    }

    generateMockLogs()
    const interval = setInterval(generateMockLogs, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const handleActivityLogChange = (activityId: number, log: string) => {
    setActivityLogs(prev => ({ ...prev, [activityId]: log }))
  }

  const handleSaveJournal = () => {
    console.log("Saving journal...", { childrenLogs, activityLogs, aiSummaries })
    // Here you would typically send this data to your backend
    alert("日誌が保存されました！")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">スタッフ日誌</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle>子供の様子</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] w-full rounded-md pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>要約</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map(child => (
                    <ChildRow key={child.id} child={child} aiSummaries={aiSummaries} childrenLogs={childrenLogs} />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle>活動記録</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] w-full rounded-md pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>時間</TableHead>
                    <TableHead>活動</TableHead>
                    <TableHead>内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.time}</TableCell>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>
                        <Textarea
                          value={activityLogs[activity.id] || ""}
                          onChange={(e) => handleActivityLogChange(activity.id, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handleSaveJournal}>日誌を保存</Button>
      </div>
    </div>
  )
}