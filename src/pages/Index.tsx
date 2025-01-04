import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { 
  Rocket, 
  BrainCog, 
  Smartphone, 
  Target, 
  Award, 
  Shield, 
  ChartBarIcon, 
  DollarSign,
  Star
} from "lucide-react";
import { Card } from "@/components/ui/card";

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
      {/* Hero Section - Enhanced with more compelling copy */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
            <Award className="h-8 w-8 text-primary" />
            <span className="text-primary font-semibold">
              #1 AI-Powered Development & Marketing Platform
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/80 mb-6 leading-tight">
            Build Apps & Scale Your Business with Advanced AI Technology
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The only platform that combines enterprise-grade AI app development with 
            intelligent marketing automation. Build faster, scale smarter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto"
            >
              Start Building For Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="text-lg px-8 py-6 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
            >
              View Enterprise Plans
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-400 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div>AI-Powered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">10x</div>
              <div>Faster Development</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">5+</div>
              <div>Ad Platforms</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div>AI Optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="bg-black/40 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Star className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade AI Technology
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our cutting-edge platform combines advanced AI models with industry-leading 
              development tools and marketing automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Development Suite */}
            <Card className="glass p-8 rounded-lg space-y-4">
              <BrainCog className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Advanced AI Development</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Full-stack web application generation with real-time preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Intelligent code optimization and debugging</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Enterprise-grade security and scalability built-in</span>
                </li>
              </ul>
            </Card>

            {/* Android Development */}
            <Card className="glass p-8 rounded-lg space-y-4">
              <Smartphone className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">Native Android Apps</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Automated Android app generation from web apps</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Native performance optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Automated Play Store deployment</span>
                </li>
              </ul>
            </Card>

            {/* AI Marketing Suite */}
            <Card className="glass p-8 rounded-lg space-y-4">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold">AI Marketing Suite</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>AI-generated ad content and creative optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Multi-platform campaign management</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Real-time performance optimization</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Ready Platform
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built for scale, security, and performance. Our platform powers businesses 
            from startups to enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass p-6 rounded-lg">
            <ChartBarIcon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
            <p className="text-gray-300">
              Comprehensive insights into both application performance and marketing campaigns.
              Make data-driven decisions with AI-powered recommendations.
            </p>
          </Card>

          <Card className="glass p-6 rounded-lg">
            <Rocket className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Rapid Deployment</h3>
            <p className="text-gray-300">
              Deploy web and Android applications with a single click. Automated scaling
              and performance optimization included.
            </p>
          </Card>

          <Card className="glass p-6 rounded-lg">
            <DollarSign className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">ROI Focused</h3>
            <p className="text-gray-300">
              Maximize your return on investment with AI-optimized development and
              marketing campaigns that deliver results.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="glass max-w-4xl mx-auto p-12 rounded-lg text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Your Next Big Thing
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and marketers who are creating the future with AI.
            Get started today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              Start Building For Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/contact")}
              className="text-lg px-8 py-6 hover:bg-white/10 transition-all duration-300"
            >
              Contact Enterprise Sales
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}