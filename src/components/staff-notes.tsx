"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"

const initialStaffNotes = [
  { id: 1, author: "永田さん", content: "たいきくんが今日は特に集中力が高かったです。明日も同じアプローチを試してみましょう。" },
  { id: 2, author: "石原さん", content: "たかふみくんが新しい友達と仲良くなりました。社会性の成長が見られます。" },
]

export default function StaffNotes() {
  const [staffNotes, setStaffNotes] = useState(initialStaffNotes)
  const [newNote, setNewNote] = useState("")

  const addStaffNote = () => {
    if (newNote.trim()) {
      setStaffNotes([...staffNotes, { id: Date.now(), author: "大鐘さん", content: newNote }])
      setNewNote("")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">スタッフノート</h2>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <MessageSquare className="w-5 h-5 mr-2" />
            スタッフ間の情報共有
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {staffNotes.map((note) => (
            <Alert key={note.id} className="bg-white">
              <AlertTitle>{note.author}</AlertTitle>
              <AlertDescription>{note.content}</AlertDescription>
            </Alert>
          ))}
          <div className="space-y-2">
            <Textarea
              placeholder="新しいノートを追加..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Button onClick={addStaffNote}>ノートを追加</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}