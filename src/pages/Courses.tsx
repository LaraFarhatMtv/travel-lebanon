
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Clock, BookOpen, Users, Star, Search, Filter } from 'lucide-react';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  const courses = [
    {
      id: 1,
      title: "Introduction to Artificial Intelligence",
      description: "Learn the foundational concepts of AI and understand its real-world applications.",
      image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
      level: "Beginner",
      category: "AI Fundamentals",
      duration: "4 weeks",
      students: 1243,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Machine Learning Foundations",
      description: "Explore the core principles of machine learning and build your first models.",
      image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
      level: "Beginner",
      category: "Machine Learning",
      duration: "6 weeks",
      students: 982,
      rating: 4.7,
    },
    {
      id: 3,
      title: "Deep Learning with Neural Networks",
      description: "Dive deep into neural networks and learn to implement advanced deep learning models.",
      image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
      level: "Intermediate",
      category: "Deep Learning",
      duration: "8 weeks",
      students: 756,
      rating: 4.9,
    },
    {
      id: 4,
      title: "Natural Language Processing",
      description: "Master the techniques to build systems that understand and generate human language.",
      image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
      level: "Intermediate",
      category: "NLP",
      duration: "7 weeks",
      students: 623,
      rating: 4.6,
    },
    {
      id: 5,
      title: "Computer Vision Projects",
      description: "Build projects that can analyze and interpret visual information from the world.",
      image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
      level: "Advanced",
      category: "Computer Vision",
      duration: "10 weeks",
      students: 489,
      rating: 4.8,
    },
    {
      id: 6,
      title: "AI Ethics and Governance",
      description: "Explore the ethical implications of AI and approaches to responsible AI development.",
      image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
      level: "All Levels",
      category: "Ethics",
      duration: "5 weeks",
      students: 372,
      rating: 4.7,
    },
  ];
  
  const categories = Array.from(new Set(courses.map(course => course.category)));
  const levels = Array.from(new Set(courses.map(course => course.level)));
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  
  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level === selectedLevel ? null : level);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-indigo-700 py-16 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Explore Our AI Courses</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Discover a wide range of courses designed to take you from AI novice to expert through 
            interactive learning and hands-on projects.
          </p>
        </div>
      </section>
      
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setSelectedLevel(null);
                }}
                variant="outline" 
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Filter size={16} /> Filter by Category
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map(category => (
                    <Badge 
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Users size={16} /> Filter by Level
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {levels.map(level => (
                    <Badge 
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleLevelSelect(level)}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      {course.category}
                    </Badge>
                    <Badge>{course.level}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-indigo-600">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Link to={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How are the courses structured?</AccordionTrigger>
              <AccordionContent>
                Our courses combine video lectures, interactive exercises, coding challenges, and 
                real-world projects. Each course is divided into modules that build upon each other, 
                allowing you to progress logically from foundational concepts to advanced applications.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do I need prior programming experience?</AccordionTrigger>
              <AccordionContent>
                For beginner courses, no prior programming experience is required. We'll teach you 
                everything you need to know from scratch. For intermediate and advanced courses, 
                basic programming knowledge (particularly Python) is recommended.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I access the course materials after completion?</AccordionTrigger>
              <AccordionContent>
                Yes, once enrolled, you'll have lifetime access to all course materials, including 
                future updates and improvements to the curriculum. This allows you to revisit 
                concepts and stay up-to-date with the latest developments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is there a certificate upon completion?</AccordionTrigger>
              <AccordionContent>
                Yes, after successfully completing a course, you'll receive a digital certificate 
                that you can share on your LinkedIn profile or with potential employers to 
                demonstrate your AI skills and knowledge.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What support is available during the courses?</AccordionTrigger>
              <AccordionContent>
                You'll have access to a community forum where you can ask questions and get help 
                from instructors and fellow students. For premium courses, we also offer direct 
                mentorship and one-on-one coaching sessions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Courses;
