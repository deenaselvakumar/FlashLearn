"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AppLayout } from "@/components/app-layout"
import { useAuth } from "@/components/auth-provider"
import { Users, Plus, Search, Crown, Trophy, UserPlus, Settings, Play, Sword, Shield } from "lucide-react"

interface StudyGroup {
  id: string
  name: string
  description: string
  owner: string
  members: {
    id: string
    username: string
    avatar: string
    role: "owner" | "admin" | "member"
    stats: {
      accuracy: number
      streak: number
      totalCards: number
    }
  }[]
  isPrivate: boolean
  inviteCode: string
  stats: {
    totalBattles: number
    totalMembers: number
    averageAccuracy: number
  }
  recentActivity: {
    type: "battle" | "join" | "achievement"
    user: string
    description: string
    timestamp: string
  }[]
}

const mockGroups: StudyGroup[] = [
  {
    id: "group_1",
    name: "Math Warriors",
    description: "Conquering calculus and algebra together! Join us for daily battles and study sessions.",
    owner: "alex_johnson",
    members: [
      {
        id: "user_1",
        username: "alex_johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "owner",
        stats: { accuracy: 78, streak: 7, totalCards: 450 },
      },
      {
        id: "user_2",
        username: "sarah_chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "member",
        stats: { accuracy: 85, streak: 12, totalCards: 320 },
      },
      {
        id: "user_3",
        username: "mike_davis",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "member",
        stats: { accuracy: 72, streak: 5, totalCards: 580 },
      },
    ],
    isPrivate: false,
    inviteCode: "MATH2024",
    stats: {
      totalBattles: 15,
      totalMembers: 3,
      averageAccuracy: 78,
    },
    recentActivity: [
      {
        type: "battle",
        user: "sarah_chen",
        description: "won a battle against mike_davis in Derivatives",
        timestamp: "2 hours ago",
      },
      {
        type: "achievement",
        user: "alex_johnson",
        description: "achieved 7-day study streak",
        timestamp: "1 day ago",
      },
    ],
  },
  {
    id: "group_2",
    name: "Science Squad",
    description: "Physics, Chemistry, Biology - we study it all! Competitive learning at its finest.",
    owner: "sarah_chen",
    members: [
      {
        id: "user_2",
        username: "sarah_chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "owner",
        stats: { accuracy: 85, streak: 12, totalCards: 320 },
      },
      {
        id: "user_4",
        username: "emma_wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "member",
        stats: { accuracy: 91, streak: 8, totalCards: 280 },
      },
    ],
    isPrivate: true,
    inviteCode: "SCI2024",
    stats: {
      totalBattles: 8,
      totalMembers: 2,
      averageAccuracy: 88,
    },
    recentActivity: [
      {
        type: "join",
        user: "emma_wilson",
        description: "joined the group",
        timestamp: "3 days ago",
      },
    ],
  },
]

export default function StudyGroupsPage() {
  const { user } = useAuth()
  const [groups, setGroups] = useState<StudyGroup[]>(mockGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    isPrivate: false,
  })

  const [joinCode, setJoinCode] = useState("")

  const handleCreateGroup = () => {
    if (!newGroup.name.trim() || !user) return

    const group: StudyGroup = {
      id: `group_${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      owner: user.username,
      members: [
        {
          id: user.id,
          username: user.username,
          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
          role: "owner",
          stats: {
            accuracy: user.stats.averageAccuracy,
            streak: user.stats.studyStreak,
            totalCards: user.stats.totalCards,
          },
        },
      ],
      isPrivate: newGroup.isPrivate,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      stats: {
        totalBattles: 0,
        totalMembers: 1,
        averageAccuracy: user.stats.averageAccuracy,
      },
      recentActivity: [],
    }

    setGroups((prev) => [...prev, group])
    setNewGroup({ name: "", description: "", isPrivate: false })
    setShowCreateDialog(false)
  }

  const handleJoinGroup = () => {
    if (!joinCode.trim() || !user) return

    const group = groups.find((g) => g.inviteCode === joinCode.toUpperCase())
    if (!group) {
      alert("Invalid invite code!")
      return
    }

    if (group.members.some((m) => m.id === user.id)) {
      alert("You're already a member of this group!")
      return
    }

    const updatedGroup = {
      ...group,
      members: [
        ...group.members,
        {
          id: user.id,
          username: user.username,
          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
          role: "member" as const,
          stats: {
            accuracy: user.stats.averageAccuracy,
            streak: user.stats.studyStreak,
            totalCards: user.stats.totalCards,
          },
        },
      ],
      stats: {
        ...group.stats,
        totalMembers: group.stats.totalMembers + 1,
      },
      recentActivity: [
        {
          type: "join" as const,
          user: user.username,
          description: "joined the group",
          timestamp: "just now",
        },
        ...group.recentActivity,
      ],
    }

    setGroups((prev) => prev.map((g) => (g.id === group.id ? updatedGroup : g)))
    setJoinCode("")
    setShowJoinDialog(false)
  }

  const myGroups = groups.filter((group) => group.members.some((member) => member.id === user?.id))

  const publicGroups = groups.filter(
    (group) =>
      !group.isPrivate &&
      !group.members.some((member) => member.id === user?.id) &&
      group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const startBattle = (group: StudyGroup, opponent: string) => {
    // This would navigate to a battle interface
    alert(`Starting battle with ${opponent} in ${group.name}!`)
  }

  if (!user) {
    return <div>Please log in to access study groups.</div>
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
            <p className="text-muted-foreground">Join groups, challenge friends, and learn together</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Study Group</DialogTitle>
                  <DialogDescription>Enter the invite code to join a study group</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-code">Invite Code</Label>
                    <Input
                      id="invite-code"
                      placeholder="Enter invite code (e.g., MATH2024)"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleJoinGroup} className="w-full">
                    Join Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                  <DialogDescription>Start a new study group and invite your friends</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input
                      id="group-name"
                      placeholder="Enter group name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea
                      id="group-description"
                      placeholder="Describe your study group"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private-group"
                      checked={newGroup.isPrivate}
                      onChange={(e) => setNewGroup((prev) => ({ ...prev, isPrivate: e.target.checked }))}
                    />
                    <Label htmlFor="private-group">Private Group (invite only)</Label>
                  </div>
                  <Button onClick={handleCreateGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="my-groups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
            <TabsTrigger value="discover">Discover Groups</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-4">
            {myGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Study Groups Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first study group or join an existing one to start learning with friends!
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Group
                    </Button>
                    <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          {group.owner === user.username && <Crown className="h-4 w-4 text-yellow-500" />}
                          {group.isPrivate && <Shield className="h-4 w-4 text-blue-500" />}
                        </div>
                        <Badge variant="secondary">{group.stats.totalMembers} members</Badge>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Group Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{group.stats.totalBattles}</div>
                          <div className="text-xs text-muted-foreground">Battles</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{group.stats.averageAccuracy}%</div>
                          <div className="text-xs text-muted-foreground">Avg Accuracy</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{group.stats.totalMembers}</div>
                          <div className="text-xs text-muted-foreground">Members</div>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Members</div>
                        <div className="space-y-2">
                          {group.members.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{member.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{member.username}</span>
                                {member.role === "owner" && <Crown className="h-3 w-3 text-yellow-500" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {member.stats.accuracy}%
                                </Badge>
                                {member.id !== user.id && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startBattle(group, member.username)}
                                  >
                                    <Sword className="h-3 w-3 mr-1" />
                                    Battle
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          {group.members.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{group.members.length - 3} more members
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Recent Activity</div>
                        <div className="space-y-1">
                          {group.recentActivity.slice(0, 2).map((activity, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              <span className="font-medium">{activity.user}</span> {activity.description}
                              <span className="ml-2">• {activity.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                          <Play className="mr-2 h-4 w-4" />
                          Start Battle
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </div>

                      {/* Invite Code */}
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Invite Code</div>
                        <div className="font-mono text-sm font-bold">{group.inviteCode}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search public groups..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {publicGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="secondary">{group.stats.totalMembers} members</Badge>
                    </div>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-orange-600">{group.stats.totalBattles}</div>
                        <div className="text-xs text-muted-foreground">Battles</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">{group.stats.averageAccuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-600">{group.stats.totalMembers}</div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Top members:</div>
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{member.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        setJoinCode(group.inviteCode)
                        handleJoinGroup()
                      }}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Study Groups
                </CardTitle>
                <CardDescription>Groups ranked by average accuracy and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groups
                    .sort((a, b) => b.stats.averageAccuracy - a.stats.averageAccuracy)
                    .slice(0, 10)
                    .map((group, index) => (
                      <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1
                                  ? "bg-gray-100 text-gray-800"
                                  : index === 2
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{group.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {group.stats.totalMembers} members • {group.stats.totalBattles} battles
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{group.stats.averageAccuracy}%</div>
                          <div className="text-xs text-muted-foreground">accuracy</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
