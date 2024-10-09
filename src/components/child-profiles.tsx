'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BarChart, Brain, Heart } from "lucide-react"
import { children } from "@/constants/children"

export default function ChildProfiles() {
  const [selectedChild, setSelectedChild] = useState<any>(null)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">児童プロフィール</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedChild(child)}>
            <CardContent className="flex items-center space-x-4 p-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={child.photo} alt={child.name} />
                <AvatarFallback>{child.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{child.name}</h3>
                <p className="text-sm text-gray-500">年齢: {child.age}歳</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedChild && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedChild.name}のプロフィール</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center"><Heart className="w-4 h-4 mr-2" /> 興味・関心</h4>
              <p>{selectedChild.interests.join("、")}</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center"><Brain className="w-4 h-4 mr-2" /> 行動パターン</h4>
              <p>{selectedChild.behavioralPatterns.join("、")}</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center"><BarChart className="w-4 h-4 mr-2" /> 学習進捗</h4>
              <div className="space-y-2">
                {Object.entries(selectedChild.learningProgress).map(([subject, progress]:any) => (
                  <div key={subject} className="flex items-center">
                    <span className="w-20">{subject === "math" ? "算数" : subject === "reading" ? "読解" : "理科"}:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="ml-2">{progress}%</span>
                  </div>
                ))}
              </div>
            </div>
            <Button>AI分析を生成</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}