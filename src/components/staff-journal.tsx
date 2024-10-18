"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, AlertTriangle, Info, Star, Printer, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const children = [
  { id: 1, name: "はなこさん" },
  { id: 2, name: "たろうさん" },
  { id: 3, name: "みさきさん" },
  { id: 4, name: "けんたさん" },
  { id: 5, name: "さくらさん" },
  { id: 6, name: "ゆうたさん" },
  { id: 7, name: "あやかさん" },
]

const activities = [
  { id: 1, name: "朝の会", time: "09:00" },
  { id: 2, name: "自由遊び", time: "09:15" },
  { id: 3, name: "おやつ時間", time: "10:30" },
  { id: 4, name: "学習時間", time: "11:00" },
  { id: 5, name: "昼食", time: "12:00" },
  { id: 6, name: "お昼寝", time: "13:00" },
  { id: 7, name: "おやつ時間", time: "14:30" },
  { id: 8, name: "帰りの会", time: "15:00" },
]

const staffMembers = [
  { id: 1, name: "山田太郎" },
  { id: 2, name: "佐藤花子" },
  { id: 3, name: "鈴木一郎" },
  { id: 4, name: "田中美咲" },
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

type MealInfo = {
  lunch: string
  morningSnack: string
  afternoonSnack: string
}

type HealthInfo = {
  illnesses: { childName: string; symptom: string; confirmer: number | null; reporter: number | null }[]
  injuries: { childName: string; injury: string; confirmer: number | null; reporter: number | null }[]
}

type ParticipantCounts = {
  [key: string]: number
}

const ChildRow = ({ child, aiSummary, onSummaryChange }: { 
  child: { id: number; name: string }, 
  aiSummary: string, 
  onSummaryChange: (id: number, summary: string) => void 
}) => {
  return (
    <TableRow className="[&_td]:py-2">
      <TableCell className="font-medium w-[100px]">{child.name}</TableCell>
      <TableCell>
        <Textarea
          value={aiSummary}
          onChange={(e) => onSummaryChange(child.id, e.target.value)}
          className="w-full min-h-[80px]"
          maxLength={100}
        />
      </TableCell>
    </TableRow>
  )
}

const StaffAvatarSelect = ({ selectedId, onSelect, label }: { selectedId: number | null, onSelect: (id: number) => void, label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <Label className="mb-1 text-xs">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-10 h-10 rounded-full p-0">
            {selectedId ? (
              <Avatar className="w-9 h-9">
                <AvatarFallback>{staffMembers.find(s => s.id === selectedId)?.name[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <span className="sr-only">Select staff</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50">
          <div className="grid grid-cols-2 gap-2">
            {staffMembers.map((staff) => (
              <Button
                key={staff.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSelect(staff.id)}
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarFallback>{staff.name[0]}</AvatarFallback>
                </Avatar>
                {staff.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function StaffJournal() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [participantCounts, setParticipantCounts] = useState<ParticipantCounts>({
    "小1": 5,
    "小2": 6,
    "小3": 4,
    "小4": 7,
    "小5": 5,
    "小6": 3
  })
  const [childrenLogs, setChildrenLogs] = useState<{ [key: number]: LogEntry[] }>({})
  const [activityLogs, setActivityLogs] = useState<{ [key: number]: string }>({})
  const [aiSummaries, setAiSummaries] = useState<{ [key: number]: string }>({})
  const [aiOverallSummary, setAiOverallSummary] = useState<string>("")
  const [staffComment, setStaffComment] = useState<string>("")
  const [mealInfo, setMealInfo] = useState<MealInfo>({
    lunch: "鮭の塩焼き、ひじきの煮物、味噌汁、ごはん",
    morningSnack: "りんごとクラッカー",
    afternoonSnack: "ヨーグルトとバナナ"
  })
  const [healthInfo, setHealthInfo] = useState<HealthInfo>({
    illnesses: [{ childName: "たろうさん", symptom: "微熱", confirmer: null, reporter: null }],
    injuries: [{ childName: "みさきさん", injury: "擦り傷（膝）", confirmer: null, reporter: null }]
  })
  const [staffNames, setStaffNames] = useState<string>("山田太郎, 佐藤花子, 鈴木一郎")

  useEffect(() => {
    // Simulate fetching logs from AI camera monitoring
    const generateMockLogs = () => {
      const newChildrenLogs: { [key: number]: LogEntry[] } = {}
      const newAiSummaries: { [key: number]: string } = {}
      const newActivityLogs: { [key: number]: string } = {}
      children.forEach(child => {
        newChildrenLogs[child.id] = Array(3).fill(null).map((_, index) => ({
          id: Date.now() + index,
          childId: child.id,
          childName: child.name,
          time: new Date(Date.now() + index * 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          activity: `${child.name}は${["元気に遊んでいます", "友達と協力しています", "集中して学習しています", "楽しそうに食事をしています", "静かに休憩しています"][Math.floor(Math.random() * 5)]}`,
          type: ["緊急", "中", "情報", "気づき"][Math.floor(Math.random() * 4)] as "緊急" | "中" | "情報" | "気づき",
          icon: [AlertCircle, AlertTriangle, Info, Star][Math.floor(Math.random() * 4)],
          color: ["bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800", "bg-blue-100 text-blue-800", "bg-green-100 text-green-800"][Math.floor(Math.random() * 4)]
        }))
        newAiSummaries[child.id] = `${child.name}は今日、全体的に${["元気", "協調的", "集中力がある", "楽しそう", "落ち着いた"][Math.floor(Math.random() * 5)]}様子でした。特に${["自由遊びの時間に積極的に友達と関わる", "学習時間に集中して取り組む", "昼食を楽しそうに食べる", "他の子の手伝いをする"][Math.floor(Math.random() * 4)]}姿が見られました。`.slice(0, 100)
      })
      activities.forEach(activity => {
        newActivityLogs[activity.id] = `${activity.name}では、子どもたちは${["積極的に参加し", "楽しそうに活動し", "協力して取り組み", "集中して取り組み"][Math.floor(Math.random() * 4)]}ました。特に${["グループ活動での協調性", "個々の創造性", "学習意欲", "コミュニケーション能力"][Math.floor(Math.random() * 4)]}が見られました。${["全員が活動に参加できていた", "一部の子どもが苦手な様子だった", "予想以上の成果が得られた", "新しい課題が見つかった"][Math.floor(Math.random() * 4)]}ため、${["今後も継続して取り組みたい", "個別のサポートを検討する", "活動内容の改善を図る", "保護者とも共有したい"][Math.floor(Math.random() * 4)]}と考えています。`
      })
      setChildrenLogs(newChildrenLogs)
      setAiSummaries(newAiSummaries)
      setActivityLogs(newActivityLogs)

      // Generate AI overall summary
      const overallSummary = `本日は全体的に落ち着いた雰囲気で、子どもたちは積極的に活動に参加していました。特に自由遊びの時間では、グループでの協力が見られ、社会性の発達が感じられました。学習時間では集中力が高く、新しい課題にも意欲的に取り組む姿が印象的でした。昼食時には、マナーを守りながら楽しく食事をする様子が見られ、食育の成果が感じられました。お昼寝の時間は、全員がしっかりと休息をとることができ、午後の活動に向けて良いリフレッシュの時間となりました。おやつの時間では、食べ物を分け合う姿も見られ、思いやりの心が育っていることが感じられました。帰りの会では、一日の振り返りを通じて、子どもたち一人一人が自分の成長を実感できる場面がありました。全体として、子どもたちの成長が感じられる充実した1日でした。今後は、個々の子どもの興味や得意分野をさらに伸ばしていけるよう、活動内容の工夫を重ねていきたいと考えています。`
      setAiOverallSummary(overallSummary)
      setStaffComment(overallSummary)
    }

    generateMockLogs()
  }, [])

  const handleActivityLogChange = (activityId: number, log: string) => {
    setActivityLogs(prev => ({ ...prev, [activityId]: log }))
  }

  const handleParticipantCountChange = (grade: string, count: number) => {
    setParticipantCounts(prev => ({ ...prev, [grade]: count }))
  }

  const handleStaffNamesChange = (names: string) => {
    setStaffNames(names)
  }

  const handleChildSummaryChange = (childId: number, summary: string) => {
    setAiSummaries(prev => ({ ...prev, [childId]: summary }))
  }

  const handleHealthInfoChange = (
    type: 'illnesses' | 'injuries',
    index: number,
    field: 'confirmer' | 'reporter',
    value: number
  ) => {
    setHealthInfo((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePreviousDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className="container mx-auto p-2 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl  font-bold">スタッフ日誌</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreviousDay}>
            <ChevronLeft className="mr-2 h-4 w-4" /> 前の日
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="date" className="sr-only">日付</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button variant="outline" onClick={handleNextDay}>
            次の日 <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={handlePrint} className="print:hidden">
            <Printer className="mr-2 h-4 w-4" /> 印刷
          </Button>
        </div>
      </div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-1">
              <Label>参加者数</Label>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(participantCounts).map(([grade, count]) => (
                  <div key={grade} className="flex flex-col items-center">
                    <Label htmlFor={`count-${grade}`} className="text-sm mb-1">{grade}</Label>
                    <Input
                      type="number"
                      id={`count-${grade}`}
                      value={count}
                      onChange={(e) => handleParticipantCountChange(grade, Number(e.target.value))}
                      min="0"
                      className="w-12 h-8 text-sm p-1"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-auto md:flex-1">
              <Label htmlFor="staffNames">スタッフ名</Label>
              <Input
                type="text"
                id="staffNames"
                value={staffNames}
                onChange={(e) => handleStaffNamesChange(e.target.value)}
                placeholder="スタッフ名を入力"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">食事・おやつ</h3>
              <p><span className="font-medium">昼食：</span>{mealInfo.lunch}</p>
              <p><span className="font-medium">午前おやつ：</span>{mealInfo.morningSnack}</p>
              <p><span className="font-medium">午後おやつ：</span>{mealInfo.afternoonSnack}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">けが・病気の報告</h3>
              <div className="space-y-2">
                {healthInfo.illnesses.map((illness, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="destructive">病気</Badge>
                    <span className="font-medium w-20">{illness.childName}</span>
                    <span className="flex-grow">{illness.symptom}</span>
                    <StaffAvatarSelect
                      selectedId={illness.confirmer}
                      onSelect={(id) => handleHealthInfoChange('illnesses', index, 'confirmer', id)}
                      label="確認者"
                    />
                    <StaffAvatarSelect
                      selectedId={illness.reporter}
                      onSelect={(id) => handleHealthInfoChange('illnesses', index, 'reporter', id)}
                      label="報告者"
                    />
                  </div>
                ))}
                {healthInfo.injuries.map((injury, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="destructive">怪我</Badge>
                    <span className="font-medium w-20">{injury.childName}</span>
                    <span className="flex-grow">{injury.injury}</span>
                    <StaffAvatarSelect
                      selectedId={injury.confirmer}
                      onSelect={(id) => handleHealthInfoChange('injuries', index, 'confirmer', id)}
                      label="確認者"
                    />
                    <StaffAvatarSelect
                      selectedId={injury.reporter}
                      onSelect={(id) => handleHealthInfoChange('injuries', index, 'reporter', id)}
                      label="報告者"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        <Card className="h-[calc(100vh-180px)] print:h-auto">
          <CardHeader   className="pb-2">
            <CardTitle>子供の様子</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] print:h-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">名前</TableHead>
                    <TableHead>要約</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map(child => (
                    <ChildRow 
                      key={child.id} 
                      child={child} 
                      aiSummary={aiSummaries[child.id]} 
                      onSummaryChange={handleChildSummaryChange}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="h-[calc(100vh-180px)] print:h-auto">
          <CardHeader className="pb-2">
            <CardTitle>活動記録</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] print:h-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">時間・活動</TableHead>
                    <TableHead>内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map(activity => (
                    <TableRow key={activity.id} className="[&_td]:py-2">
                      <TableCell className="align-top">
                        <div className="font-medium">{activity.time}</div>
                        <div>{activity.name}</div>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={activityLogs[activity.id] || ""}
                          onChange={(e) => handleActivityLogChange(activity.id, e.target.value)}
                          className="w-full min-h-[80px]"
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
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>総括コメント</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={staffComment}
            onChange={(e) => setStaffComment(e.target.value)}
            className="min-h-[200px]"
            placeholder="本日の活動や子供たちの様子について、総括的なコメントを記入してください。"
          />
        </CardContent>
      </Card>
    </div>
  )
}