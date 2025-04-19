
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink, Calendar } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "Lebanon Interactive Tourism Map",
    category: "web-development",
    tags: ["React", "Mapbox", "Tourism"],
    description: "An interactive map showcasing Lebanon's top attractions, historical sites, and natural landmarks. Users can filter by region and type of attraction.",
    image: "https://images.unsplash.com/photo-1577411731337-fed868354595?q=80&w=1976&auto=format&fit=crop",
    github: "https://github.com/username/lebanon-map",
    demo: "https://lebanon-interactive-map.example.com",
    date: "April 2025"
  },
  {
    id: 2,
    title: "Lebanese Cuisine Recipe App",
    category: "mobile-app",
    tags: ["React Native", "Firebase", "Food"],
    description: "A mobile application featuring authentic Lebanese recipes, cooking videos, and ingredient information. Includes offline mode and shopping list feature.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    github: "https://github.com/username/lebanese-recipes",
    demo: "https://lebanese-recipes.example.com",
    date: "March 2025"
  },
  {
    id: 3,
    title: "Cedar Forest Conservation Dashboard",
    category: "data-science",
    tags: ["Python", "Data Visualization", "Conservation"],
    description: "An analytical dashboard tracking the health of Lebanon's cedar forests. Includes deforestation trends, conservation efforts, and impact assessment.",
    image: "https://images.unsplash.com/photo-1513977055326-8ae5562a69de?q=80&w=2070&auto=format&fit=crop",
    github: "https://github.com/username/cedar-conservation",
    demo: "https://cedar-conservation.example.com",
    date: "February 2025"
  },
  {
    id: 4,
    title: "Lebanese Cultural Heritage AR Experience",
    category: "mobile-app",
    tags: ["Unity", "ARKit", "Cultural Heritage"],
    description: "An augmented reality application that brings Lebanese historical sites to life through interactive 3D models and informative overlays.",
    image: "https://images.unsplash.com/photo-1588156979401-db3662249ae7?q=80&w=2071&auto=format&fit=crop",
    github: "https://github.com/username/lebanon-heritage-ar",
    demo: "https://lebanon-heritage-ar.example.com",
    date: "January 2025"
  },
  {
    id: 5,
    title: "Lebanese Wine Tasting Tour Planner",
    category: "web-development",
    tags: ["Vue.js", "Node.js", "Tourism"],
    description: "A web application for planning wine tasting tours in Lebanon's Bekaa Valley. Features winery profiles, tour scheduling, and tasting notes.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop",
    github: "https://github.com/username/lebanon-wine-tours",
    demo: "https://lebanon-wine-tours.example.com",
    date: "December 2024"
  },
  {
    id: 6,
    title: "Beirut Street Art Map",
    category: "web-development",
    tags: ["JavaScript", "Google Maps API", "Art"],
    description: "An interactive map documenting street art across Beirut, with artist information, creation dates, and the stories behind each piece.",
    image: "https://images.unsplash.com/photo-1577117076608-161e8b5f4414?q=80&w=1974&auto=format&fit=crop",
    github: "https://github.com/username/beirut-street-art",
    demo: "https://beirut-street-art.example.com",
    date: "November 2024"
  }
];

const Projects = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577117076608-161e8b5f4414?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Explore our innovative projects showcasing Lebanon's rich culture, heritage, and natural beauty
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="web-development">Web Development</TabsTrigger>
            <TabsTrigger value="mobile-app">Mobile Apps</TabsTrigger>
            <TabsTrigger value="data-science">Data Science</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <ProjectGrid projects={projects} />
          </TabsContent>
          
          <TabsContent value="web-development" className="mt-6">
            <ProjectGrid projects={projects.filter(project => project.category === 'web-development')} />
          </TabsContent>
          
          <TabsContent value="mobile-app" className="mt-6">
            <ProjectGrid projects={projects.filter(project => project.category === 'mobile-app')} />
          </TabsContent>
          
          <TabsContent value="data-science" className="mt-6">
            <ProjectGrid projects={projects.filter(project => project.category === 'data-science')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ProjectGrid = ({ projects }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {projects.map((project) => (
      <Card key={project.id} className="overflow-hidden flex flex-col h-full">
        <div className="h-48 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Calendar className="h-3.5 w-3.5" />
            {project.date}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-amber-50 border-amber-200 text-amber-800">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <Button asChild variant="outline" size="sm">
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Github className="h-4 w-4" /> Code
            </a>
          </Button>
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" /> Demo
            </a>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default Projects;
