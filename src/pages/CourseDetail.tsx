
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Play, 
  FileText, 
  Code, 
  Award, 
  Check, 
  Users, 
  Heart, 
  Share2,
  Star 
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Simulated course data
  const course = {
    id: courseId,
    title: "Introduction to Artificial Intelligence",
    description: "A comprehensive introduction to the world of artificial intelligence, covering fundamental concepts, key algorithms, and practical applications. This course is designed for beginners and requires no prior experience with AI.",
    image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
    level: "Beginner",
    category: "AI Fundamentals",
    duration: "4 weeks",
    lessons: 24,
    instructor: {
      name: "Dr. Sarah Johnson",
      title: "AI Research Scientist",
      bio: "Dr. Johnson has over 10 years of experience in AI research and has published numerous papers on machine learning and neural networks. She previously worked at Google AI and now teaches at MIT.",
      image: "/lovable-uploads/9d866bf4-f430-4a69-bcd6-f10f5400da25.png"
    },
    rating: 4.8,
    reviewCount: 342,
    students: 1243,
    lastUpdated: "2025-03-15",
    price: 49.99,
    discountPrice: 39.99,
    objectives: [
      "Understand fundamental concepts and terminology in AI",
      "Implement basic machine learning algorithms from scratch",
      "Apply AI techniques to solve real-world problems",
      "Build and evaluate your own AI models",
      "Recognize ethical considerations in AI development",
      "Stay updated with recent advances in the field"
    ],
    modules: [
      {
        title: "Introduction to AI Concepts",
        lessons: [
          { title: "What is Artificial Intelligence?", duration: "15 min", type: "video" },
          { title: "Brief History of AI", duration: "20 min", type: "video" },
          { title: "Types of AI Systems", duration: "25 min", type: "video" },
          { title: "AI Quiz: Basic Concepts", duration: "10 min", type: "quiz" }
        ]
      },
      {
        title: "Machine Learning Foundations",
        lessons: [
          { title: "Introduction to Machine Learning", duration: "30 min", type: "video" },
          { title: "Supervised vs. Unsupervised Learning", duration: "25 min", type: "video" },
          { title: "Training and Evaluation", duration: "20 min", type: "video" },
          { title: "Hands-on: Your First ML Model", duration: "45 min", type: "practice" }
        ]
      },
      {
        title: "Neural Networks",
        lessons: [
          { title: "Neural Network Basics", duration: "35 min", type: "video" },
          { title: "Activation Functions", duration: "20 min", type: "video" },
          { title: "Backpropagation Explained", duration: "40 min", type: "video" },
          { title: "Building a Simple Neural Network", duration: "60 min", type: "practice" }
        ]
      },
      {
        title: "Applications and Ethics",
        lessons: [
          { title: "AI in Healthcare", duration: "25 min", type: "video" },
          { title: "AI in Finance", duration: "20 min", type: "video" },
          { title: "Ethical Considerations in AI", duration: "30 min", type: "video" },
          { title: "Final Project", duration: "120 min", type: "project" }
        ]
      }
    ],
    requirements: [
      "Basic understanding of mathematics (algebra and calculus)",
      "Some programming experience is helpful but not required",
      "A computer with internet access"
    ]
  };

  // Function to toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked 
        ? "Course removed from your saved courses" 
        : "Course saved to your bookmarks",
      duration: 3000
    });
  };

  // Function to handle course enrollment
  const enrollCourse = () => {
    toast({
      title: "Enrolled Successfully!",
      description: `You have enrolled in "${course.title}"`,
      duration: 3000
    });
  };

  // Function to share course
  const shareCourse = () => {
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "Link Copied!",
      description: "Course link copied to clipboard",
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Hero */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-900 py-12 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-400">{course.category}</Badge>
                <Badge variant="outline" className="text-indigo-100 border-indigo-300">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              
              <p className="text-indigo-100 text-lg">{course.description}</p>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-indigo-200">({course.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5 text-indigo-300" />
                  <span>{course.students} students</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-indigo-300" />
                  <span>Last updated: {new Date(course.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={course.instructor.image} 
                    alt={course.instructor.name} 
                    className="h-10 w-10 rounded-full object-cover border-2 border-indigo-400" 
                  />
                  <div>
                    <p className="font-medium">{course.instructor.name}</p>
                    <p className="text-sm text-indigo-200">{course.instructor.title}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-xl">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-gray-900">
                      ${course.discountPrice}
                      {course.discountPrice < course.price && (
                        <span className="text-lg font-normal line-through ml-2 text-gray-500">
                          ${course.price}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      20% off
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full text-lg py-6 bg-indigo-600 hover:bg-indigo-700" onClick={enrollCourse}>
                      Enroll Now
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center justify-center gap-2" onClick={toggleBookmark}>
                        <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                        {isBookmarked ? 'Saved' : 'Save'}
                      </Button>
                      
                      <Button variant="outline" className="flex items-center justify-center gap-2" onClick={shareCourse}>
                        <Share2 className="h-5 w-5" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardContent className="border-t border-gray-200 mt-4 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">This course includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Play className="h-4 w-4 text-indigo-600" />
                      <span>{course.lessons} on-demand videos</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText className="h-4 w-4 text-indigo-600" />
                      <span>Comprehensive resources</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Code className="h-4 w-4 text-indigo-600" />
                      <span>Hands-on coding exercises</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Award className="h-4 w-4 text-indigo-600" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span>Full lifetime access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Content Tabs */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8 border-b w-full justify-start rounded-none h-auto pb-0 bg-transparent">
              <TabsTrigger 
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 pb-2 pt-1 px-4 text-base"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="curriculum"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 pb-2 pt-1 px-4 text-base"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger 
                value="instructor"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 pb-2 pt-1 px-4 text-base"
              >
                Instructor
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 pb-2 pt-1 px-4 text-base"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <span>{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                    <div className="prose max-w-none">
                      <p className="mb-4">
                        This comprehensive course is designed to give you a solid foundation in artificial intelligence concepts and applications. 
                        Whether you're a student, a professional looking to expand your skillset, or simply curious about AI, 
                        this course will provide you with the knowledge and practical experience needed to understand and implement AI solutions.
                      </p>
                      <p className="mb-4">
                        Through a combination of theoretical lectures, hands-on exercises, and real-world projects, 
                        you'll gain both conceptual understanding and practical skills. By the end of this course, 
                        you'll be able to build and evaluate your own AI models and understand how AI can be applied across different industries.
                      </p>
                      <p>
                        The course is structured to be accessible to beginners while still providing valuable insights 
                        for those with some prior experience in related fields. We start with fundamental concepts and 
                        progressively move to more advanced topics, ensuring a smooth learning journey.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} />
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Start Date</span>
                          <span>Not started</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion</span>
                          <span>Not completed</span>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-2" variant="outline">
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Course Content</h2>
                  <div className="text-sm text-gray-600">
                    <span>{course.modules.length} modules • </span>
                    <span>{course.lessons} lessons • </span>
                    <span>{course.duration} total duration</span>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                      <AccordionTrigger className="hover:bg-gray-50 px-4">
                        <div className="flex flex-1 justify-between items-center">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-gray-600 mr-4">
                            {module.lessons.length} lessons
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div 
                              key={lessonIndex} 
                              className="p-3 hover:bg-gray-50 rounded-md flex justify-between items-center"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.type === 'video' && <Play className="h-4 w-4 text-indigo-600" />}
                                {lesson.type === 'quiz' && <FileText className="h-4 w-4 text-orange-500" />}
                                {lesson.type === 'practice' && <Code className="h-4 w-4 text-green-600" />}
                                {lesson.type === 'project' && <Award className="h-4 w-4 text-purple-600" />}
                                <span>{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{lesson.type}</Badge>
                                <span className="text-xs text-gray-600">{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            
            {/* Instructor Tab */}
            <TabsContent value="instructor" className="mt-0">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img 
                  src={course.instructor.image} 
                  alt={course.instructor.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100" 
                />
                <div>
                  <h2 className="text-2xl font-bold mb-1">{course.instructor.name}</h2>
                  <p className="text-gray-600 mb-4">{course.instructor.title}</p>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-600">Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">12,342</span>
                      <span className="text-gray-600">Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">8</span>
                      <span className="text-gray-600">Courses</span>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="mb-4">
                      {course.instructor.bio}
                    </p>
                    <p>
                      She specializes in machine learning, deep learning, and AI ethics, with a passion for making 
                      complex topics accessible to students of all backgrounds. Her teaching approach focuses on 
                      practical applications that prepare students for real-world AI implementation.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{course.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Course Rating • {course.reviewCount} Reviews</p>
                  </div>
                  
                  <div className="space-y-2 mt-8">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = rating === 5 ? 75 : 
                                       rating === 4 ? 18 : 
                                       rating === 3 ? 5 : 
                                       rating === 2 ? 1.5 : 0.5;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span>{rating}</span>
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          </div>
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-sm text-gray-600">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-6">
                  <h2 className="text-2xl font-bold">Student Feedback</h2>
                  
                  {[
                    {
                      name: "Michael Chen",
                      date: "2025-03-02",
                      rating: 5,
                      comment: "This is one of the best courses I've taken on AI. The instructor explains complex concepts in an easy-to-understand way, and the hands-on projects really helped solidify my understanding."
                    },
                    {
                      name: "Emily Rodriguez",
                      date: "2025-02-15",
                      rating: 4,
                      comment: "Great course overall. I particularly enjoyed the neural networks section and the practical exercises. Would have liked more depth on ethical considerations, but otherwise excellent content."
                    },
                    {
                      name: "David Kim",
                      date: "2025-01-28",
                      rating: 5,
                      comment: "As someone with no prior AI experience, I found this course to be the perfect introduction. The pace is good and the examples are relevant and interesting. Highly recommended for beginners!"
                    }
                  ].map((review, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{review.name}</CardTitle>
                            <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Related Courses */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Related Courses</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Machine Learning Foundations",
                image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
                level: "Beginner",
                category: "Machine Learning",
                rating: 4.7,
                students: 982
              },
              {
                title: "Python for AI Development",
                image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
                level: "Beginner",
                category: "Programming",
                rating: 4.6,
                students: 1456
              },
              {
                title: "AI Ethics and Governance",
                image: "/lovable-uploads/69c52506-0d3b-4afc-a9a5-e3151c28f7fc.png",
                level: "All Levels",
                category: "Ethics",
                rating: 4.8,
                students: 624
              }
            ].map((relatedCourse, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={relatedCourse.image} 
                    alt={relatedCourse.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{relatedCourse.category}</Badge>
                    <Badge>{relatedCourse.level}</Badge>
                  </div>
                  <CardTitle className="text-lg">{relatedCourse.title}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{relatedCourse.rating}</span>
                    <span className="text-gray-600">({relatedCourse.students} students)</span>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/courses/${index + 2}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
