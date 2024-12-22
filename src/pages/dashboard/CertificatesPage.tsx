import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Download, Search, Award, Share2, Calendar,
  CheckCircle, Trophy, Medal, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for certificates
const mockCertificates = [
  {
    id: 1,
    title: "Web Development Mastery",
    issueDate: "2024-02-15",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    grade: "A",
    instructor: "Dr. Sarah Johnson",
    credentialId: "WD-2024-1234",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    featured: true
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    issueDate: "2024-01-20",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    grade: "A+",
    instructor: "Prof. Michael Chen",
    credentialId: "UX-2024-5678",
    skills: ["Figma", "UI Design", "User Research"],
    featured: false
  },
  {
    id: 3,
    title: "Digital Marketing Excellence",
    issueDate: "2023-12-10",
    image: "https://images.unsplash.com/photo-1496469888073-80de7e952517?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    grade: "B+",
    instructor: "Emma Thompson",
    credentialId: "DM-2023-9012",
    skills: ["SEO", "Social Media", "Content Marketing"],
    featured: false
  },
  {
    id: 4,
    title: "Data Science Fundamentals",
    issueDate: "2023-11-05",
    image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    grade: "A",
    instructor: "Dr. John Smith",
    credentialId: "DS-2023-3456",
    skills: ["Python", "Data Analysis", "Machine Learning"],
    featured: true
  }
];

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "featured">("all");

  const filteredCertificates = mockCertificates
    .filter(cert => 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(cert => selectedFilter === "all" || cert.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Your Achievements</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Showcase your learning journey with verified certificates from completed courses.
              Each certificate represents your dedication and expertise.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Award className="h-5 w-5" />, label: "Total Certificates", value: mockCertificates.length },
              { icon: <Star className="h-5 w-5" />, label: "Featured", value: mockCertificates.filter(c => c.featured).length },
              { icon: <Trophy className="h-5 w-5" />, label: "Top Grades", value: mockCertificates.filter(c => c.grade === "A+").length },
              { icon: <Medal className="h-5 w-5" />, label: "Skills Earned", value: mockCertificates.flatMap(c => c.skills).length }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certificates..."
                className="pl-9 bg-card/50 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                className="rounded-lg"
              >
                All Certificates
              </Button>
              <Button
                variant={selectedFilter === "featured" ? "default" : "outline"}
                onClick={() => setSelectedFilter("featured")}
                className="rounded-lg"
              >
                Featured
              </Button>
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCertificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-none hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[2/1.4]">
                    <img
                      src={certificate.image}
                      alt={certificate.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    
                    {certificate.featured && (
                      <Badge 
                        className="absolute top-4 right-4 bg-primary/90 hover:bg-primary"
                      >
                        Featured
                      </Badge>
                    )}

                    <div className="absolute inset-x-4 bottom-4 text-white">
                      <h3 className="text-lg font-semibold mb-2">{certificate.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Calendar className="h-4 w-4" />
                        <span>Issued {new Date(certificate.issueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Instructor</p>
                        <p className="font-medium">{certificate.instructor}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className="font-bold text-primary">{certificate.grade}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Skills Earned</p>
                      <div className="flex flex-wrap gap-2">
                        {certificate.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        ID: {certificate.credentialId}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 