
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Brain, Code, Lightbulb, MessageSquare, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-indigo-700 py-20 px-6 md:px-12 lg:px-24 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOCAwIDIuNDQ1LjIwNCAzLjYxMS41OTcuMzQuMTE1LjUxNi40ODMuMzkuODI2bC0uMDA1LjAxMmExLjQyIDEuNDIgMCAwIDEtLjQzNS40NDUgMS4wMTggMS4wMTggMCAwIDEtLjc3Mi4xMTQgMTEuMjMyIDExLjIzMiAwIDAgMC0yLjc4OS0uMzQ4Yy02LjE5OCAwLTExLjIyNSA1LjAyNy0xMS4yMjUgMTEuMjI1IDAgNi4xOTkgNS4wMjcgMTEuMjI1IDExLjIyNSAxMS4yMjUgNi4xOTkgMCAxMS4yMjUtNS4wMjYgMTEuMjI1LTExLjIyNSAwLS45NTgtLjEyLTEuOTEzLS4zNTctMi44NDZhMS4wMiAxLjAyIDAgMCAxIC4xLS43ODcgMS40MiAxLjQyIDAgMCAxIC40NC0uNDQ2Yy4zNC0uMTgxLjc2NC0uMDM0LjkzOS4zMjRBMTMuMjUyIDEzLjI1MiAwIDAgMSA0OS4yNSAzMGMwIDcuMzA0LTUuOTQ2IDEzLjI1LTEzLjI1IDEzLjI1UzIyLjc1IDM3LjMwNCAyMi43NSAzMGMwLTcuMzA0IDUuOTQ2LTEzLjI1IDEzLjI1LTEzLjI1eiIvPjwvZz48L2c+PC9zdmc+')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About <span className="text-indigo-300">AILearn</span></h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            We're on a mission to make artificial intelligence education accessible, interactive, and engaging for students around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              <Link to="/courses">Explore Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-indigo-800">
              <a href="#our-story">Our Story</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  At AILearn, we believe that understanding artificial intelligence is no longer optional—it's essential. 
                  As AI transforms industries and shapes our future, we're committed to demystifying this technology and 
                  making it accessible to students everywhere.
                </p>
                <p className="text-gray-700">
                  Our mission is to provide high-quality, interactive AI education that bridges the gap between theory and practice. 
                  We design our courses to foster both technical proficiency and critical thinking about the ethical implications 
                  of AI development.
                </p>
                <p className="text-gray-700">
                  Through engaging content, hands-on projects, and a supportive learning community, we empower students to 
                  not just understand AI but to actively participate in shaping its responsible development and application.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/9d866bf4-f430-4a69-bcd6-f10f5400da25.png" 
                alt="Our Mission" 
                className="rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 bg-indigo-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly explore new teaching methods and technologies to enhance the learning experience
                  and keep our content at the cutting edge of AI development.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 bg-green-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
                <p className="text-gray-600">
                  We design our courses to be accessible to diverse audiences, regardless of background or prior experience,
                  and foster an inclusive learning community.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 bg-amber-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Practical Learning</h3>
                <p className="text-gray-600">
                  We believe in learning by doing, which is why our courses emphasize hands-on projects and real-world
                  applications rather than just theoretical knowledge.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Technical Excellence</h3>
                <p className="text-gray-600">
                  We maintain high standards in our course content, ensuring that students gain solid technical skills
                  that prepare them for real-world challenges.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 bg-purple-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-600">
                  We foster a collaborative environment where students can learn from each other, share ideas, and
                  build connections that extend beyond the classroom.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 bg-red-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ethical Awareness</h3>
                <p className="text-gray-600">
                  We integrate ethical considerations throughout our curriculum, encouraging students to think critically
                  about the societal impacts of AI technologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section id="our-story" className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
          <div className="prose max-w-none">
            <p>
              AILearn began in 2023 when a group of AI researchers and educators recognized a significant gap in how artificial 
              intelligence was being taught. Traditional educational approaches weren't keeping pace with the rapid evolution 
              of AI technology, and many courses lacked the practical elements needed to truly understand these complex systems.
            </p>
            <p>
              Our founders—experts from leading tech companies and academic institutions—set out to create a learning platform 
              that would make AI education more interactive, accessible, and relevant. They envisioned courses that would not 
              only teach technical concepts but also address the ethical implications and real-world applications of AI.
            </p>
            <p>
              Starting with just three initial courses, AILearn quickly gained recognition for its innovative approach to teaching 
              complex AI concepts. Students appreciated the hands-on projects, interactive visualizations, and the supportive 
              community that developed around the platform.
            </p>
            <p>
              Today, AILearn offers a comprehensive curriculum spanning from introductory concepts to advanced applications in 
              machine learning, neural networks, computer vision, and natural language processing. Our courses have helped thousands 
              of students worldwide develop valuable skills and launch careers in AI and related fields.
            </p>
            <p>
              As AI continues to evolve, so does AILearn. We remain committed to our mission of making AI education accessible, 
              practical, and ethically grounded, ensuring that students are well-prepared to participate in the AI-driven future.
            </p>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Meet the educators, researchers, and technology experts who make AILearn possible. Our diverse team brings together 
            decades of experience in artificial intelligence and education.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                title: "Founder & Lead AI Educator",
                image: "/lovable-uploads/9d866bf4-f430-4a69-bcd6-f10f5400da25.png",
                bio: "Former Google AI researcher with a passion for making complex AI concepts accessible to all."
              },
              {
                name: "Prof. James Chen",
                title: "Chief Academic Officer",
                image: "/lovable-uploads/9d866bf4-f430-4a69-bcd6-f10f5400da25.png",
                bio: "AI ethics specialist with 15 years of experience teaching at leading universities."
              },
              {
                name: "Maya Rodriguez",
                title: "Head of Curriculum",
                image: "/lovable-uploads/9d866bf4-f430-4a69-bcd6-f10f5400da25.png",
                bio: "EdTech innovator focused on creating engaging and interactive learning experiences."
              },
              {
                name: "Dr. Alex Patel",
                title: "Technical Director",
                image: "/lovable-uploads/9d866bf4-f430-4a69-bcd6-f10f5400da25.png",
                bio: "Machine learning expert and former lead engineer at OpenAI and Microsoft Research."
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-indigo-600 mb-2">{member.title}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the AILearn Community</h2>
          <p className="text-lg mb-8 text-indigo-100 max-w-2xl mx-auto">
            Become part of a growing community of AI learners and practitioners. Start your journey into the world of 
            artificial intelligence today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              <Link to="/signup">Sign Up Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-indigo-800">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
