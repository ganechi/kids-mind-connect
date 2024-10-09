'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function Settings() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">設定</h2>
      <Card>
        <CardHeader>
          <CardTitle>プライバシー設定</CardTitle>
          <CardDescription>データとプライバシーの設定を管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sharing">パーソナライズされた分析のためにAIとデータを共有</Label>
            <Switch id="data-sharing" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="photo-recognition">感情追跡のための写真認識を有効化</Label>
            <Switch id="photo-recognition" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>アカウント設定</CardTitle>
          <CardDescription>アカウントとアクセスレベルを管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">ユーザーロール</Label>
            <Select defaultValue="staff">
              <SelectTrigger id="role">
                <SelectValue placeholder="ユーザーロールを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">スタッフ</SelectItem>
                <SelectItem value="parent">保護者</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">パスワード変更</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
          <CardDescription>更新の受け取り方を選択します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">メール通知</Label>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">プッシュ通知</Label>
            <Switch id="push-notifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}