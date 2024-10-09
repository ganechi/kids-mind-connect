'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Pie, Cell } from 'recharts';

export default function Reports() {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">レポート</h2>
      <div className="flex justify-between items-center">
        <Select defaultValue="daily">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="レポートタイプを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">日次レポート</SelectItem>
            <SelectItem value="weekly">週次レポート</SelectItem>
            <SelectItem value="monthly">月次レポート</SelectItem>
          </SelectContent>
        </Select>
        <Button>レポート生成</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>感情トレンド</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: "月", happy: 4, calm: 3, excited: 2 },
                { name: "火", happy: 3, calm: 4, excited: 3 },
                { name: "水", happy: 5, calm: 2, excited: 4 },
                { name: "木", happy: 4, calm: 3, excited: 3 },
                { name: "金", happy: 3, calm: 5, excited: 2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="happy" stroke="#8884d8" name="嬉しい" />
                <Line type="monotone" dataKey="calm" stroke="#82ca9d" name="落ち着いている" />
                <Line type="monotone" dataKey="excited" stroke="#ffc658" name="興奮している" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>活動参加</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "アート", value: 30 },
                    { name: "スポーツ", value: 25 },
                    { name: "読書", value: 20 },
                    { name: "科学", value: 25 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {
                    [
                      { name: "アート", value: 30 },
                      { name: "スポーツ", value: 25 },
                      { name: "読書", value: 20 },
                      { name: "科学", value: 25 },
                    ].map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>学習進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: "第1週", math: 65, reading: 70, science: 60 },
                { name: "第2週", math: 68, reading: 72, science: 62 },
                { name: "第3週", math: 72, reading: 75, science: 65 },
                { name: "第4週", math: 75, reading: 78, science: 68 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="math" fill="#8884d8" name="算数" />
                <Bar dataKey="reading" fill="#82ca9d" name="読解" />
                <Bar dataKey="science" fill="#ffc658" name="理科" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}