import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Rocket, Computer, Target, Globe, ChartBarIcon, BrainCog, Smartphone, Award } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const session = useSession();

  const handleGetStarted = () => {
    if (session) {
      navigate("/assistant");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-black/95">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/80 mb-6">
            The Most Advanced AI Platform for Building & Marketing Apps
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Create Web Apps, Android Apps, and Run AI-Powered Marketing Campaigns - All in One Platform
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            Get Started For Free
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-black/40 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need to Build and Scale
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI App Development */}
            <div className="glass p-6 rounded-lg">
              <Computer className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI-Powered Development</h3>
              <p className="text-gray-300">
                Create full-stack web applications with AI assistance. From frontend to backend, everything is automated.
              </p>
            </div>

            {/* Android Apps */}
            <div className="glass p-6 rounded-lg">
              <Smartphone className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Android App Creation</h3>
              <p className="text-gray-300">
                Build and deploy native Android applications automatically. No mobile expertise required.
              </p>
            </div>

            {/* AI Marketing */}
            <div className="glass p-6 rounded-lg">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Marketing Suite</h3>
              <p className="text-gray-300">
                Create, manage, and optimize ad campaigns across all major platforms with AI-driven insights.
              </p>
            </div>

            {/* Global Deployment */}
            <div className="glass p-6 rounded-lg">
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Global Deployment</h3>
              <p className="text-gray-300">
                Deploy your applications worldwide with just one click. Automatic scaling included.
              </p>
            </div>

            {/* Analytics */}
            <div className="glass p-6 rounded-lg">
              <ChartBarIcon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-300">
                Get deep insights into both your application performance and marketing campaigns.
              </p>
            </div>

            {/* AI Optimization */}
            <div className="glass p-6 rounded-lg">
              <BrainCog className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Optimization</h3>
              <p className="text-gray-300">
                Continuous AI-driven optimization for both your apps and marketing campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Innovators Worldwide</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            {/* Add partner logos here */}
            <div className="h-12 w-32 bg-white/10 rounded"></div>
            <div className="h-12 w-32 bg-white/10 rounded"></div>
            <div className="h-12 w-32 bg-white/10 rounded"></div>
            <div className="h-12 w-32 bg-white/10 rounded"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-gray-300">AI-Powered</div>
          </div>
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">10x</div>
            <div className="text-sm text-gray-300">Faster Development</div>
          </div>
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-gray-300">AI Optimization</div>
          </div>
          <div className="glass p-6 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <div className="text-sm text-gray-300">Ad Platforms</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="glass max-w-3xl mx-auto p-12 rounded-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Your Next Big Thing
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers and marketers who are creating the future with AI.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            Get Started For Free
          </Button>
        </div>
      </div>
    </div>
  );
}