
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Newspaper, FileDown, ExternalLink, Calendar } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: "Lebanon Travel Guide 2025",
    category: "guide",
    type: "PDF Document",
    description: "A comprehensive guide to traveling in Lebanon, featuring top destinations, cultural insights, safety tips, and suggested itineraries.",
    link: "https://example.com/lebanon-travel-guide.pdf",
    date: "April 2025",
    size: "8.2 MB"
  },
  {
    id: 2,
    title: "Lebanese Cuisine: Beyond Hummus and Tabbouleh",
    category: "article",
    type: "Blog Article",
    description: "An in-depth exploration of Lebanese culinary traditions, highlighting lesser-known dishes and regional specialties.",
    link: "https://example.com/lebanese-cuisine-article",
    date: "March 2025"
  },
  {
    id: 3,
    title: "Hiking Trails of Mount Lebanon",
    category: "guide",
    type: "PDF Map Pack",
    description: "Detailed topographic maps of popular hiking routes through the Mount Lebanon range, with difficulty ratings and points of interest.",
    link: "https://example.com/lebanon-hiking-trails.zip",
    date: "February 2025",
    size: "15.7 MB"
  },
  {
    id: 4,
    title: "Exploring Baalbek: Virtual Tour",
    category: "video",
    type: "Video",
    description: "A 4K virtual tour of the ancient Roman temples at Baalbek, with historical commentary and architectural insights.",
    link: "https://example.com/baalbek-virtual-tour",
    date: "January 2025",
    duration: "18:32"
  },
  {
    id: 5,
    title: "Lebanese Arabic Phrasebook",
    category: "guide",
    type: "PDF Document",
    description: "Essential phrases in Lebanese Arabic for travelers, with phonetic pronunciations and cultural context.",
    link: "https://example.com/lebanese-arabic-phrasebook.pdf",
    date: "December 2024",
    size: "3.5 MB"
  },
  {
    id: 6,
    title: "The Cedars of God: Conservation Efforts",
    category: "article",
    type: "Research Paper",
    description: "An academic paper detailing ongoing conservation efforts to protect Lebanon's ancient cedar forests, a UNESCO World Heritage site.",
    link: "https://example.com/cedar-conservation-paper",
    date: "November 2024"
  },
  {
    id: 7,
    title: "Beirut Street Food Tour",
    category: "video",
    type: "Video",
    description: "A culinary journey through Beirut's vibrant street food scene, featuring local vendors and authentic recipes.",
    link: "https://example.com/beirut-street-food-tour",
    date: "October 2024",
    duration: "24:15"
  },
  {
    id: 8,
    title: "Lebanon Festival Calendar 2025",
    category: "guide",
    type: "PDF Calendar",
    description: "A month-by-month guide to Lebanon's cultural festivals, religious celebrations, and seasonal events.",
    link: "https://example.com/lebanon-festival-calendar.pdf",
    date: "September 2024",
    size: "5.8 MB"
  },
  {
    id: 9,
    title: "Wine Regions of the Bekaa Valley",
    category: "article",
    type: "Magazine Feature",
    description: "An illustrated guide to Lebanon's premier wine-producing region, featuring vineyard profiles and tasting notes.",
    link: "https://example.com/bekaa-wine-article",
    date: "August 2024"
  }
];

const Resources = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577411731337-fed868354595?q=80&w=1976&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative py-16 px-6 md:px-12 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Resources & Guides</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Explore our collection of guides, articles, and videos to enhance your Lebanese adventure
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="guide">Guides & Maps</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <ResourceGrid resources={resources} />
          </TabsContent>
          
          <TabsContent value="guide" className="mt-6">
            <ResourceGrid resources={resources.filter(resource => resource.category === 'guide')} />
          </TabsContent>
          
          <TabsContent value="article" className="mt-6">
            <ResourceGrid resources={resources.filter(resource => resource.category === 'article')} />
          </TabsContent>
          
          <TabsContent value="video" className="mt-6">
            <ResourceGrid resources={resources.filter(resource => resource.category === 'video')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ResourceGrid = ({ resources }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {resources.map((resource) => (
      <Card key={resource.id} className="overflow-hidden flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">{resource.title}</CardTitle>
            
            <Badge variant={getBadgeVariant(resource.category)} className="mt-1">
              {getResourceIcon(resource.category)}
              {resource.type}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Calendar className="h-3.5 w-3.5" />
            {resource.date}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <p className="text-gray-600 mb-4">{resource.description}</p>
          
          {resource.size && (
            <div className="text-sm text-gray-500">
              File size: {resource.size}
            </div>
          )}
          
          {resource.duration && (
            <div className="text-sm text-gray-500">
              Duration: {resource.duration}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <Button asChild className="w-full" variant={resource.category === 'guide' ? 'default' : 'outline'}>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              {resource.category === 'guide' ? (
                <>
                  <FileDown className="h-4 w-4" /> Download Resource
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" /> View Resource
                </>
              )}
            </a>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

const getResourceIcon = (category) => {
  switch (category) {
    case 'guide':
      return <FileText className="h-3.5 w-3.5 mr-1" />;
    case 'video':
      return <Video className="h-3.5 w-3.5 mr-1" />;
    case 'article':
      return <Newspaper className="h-3.5 w-3.5 mr-1" />;
    default:
      return null;
  }
};

const getBadgeVariant = (category) => {
  switch (category) {
    case 'guide':
      return 'default';
    case 'video':
      return 'secondary';
    case 'article':
      return 'outline';
    default:
      return 'default';
  }
};

export default Resources;
