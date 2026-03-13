import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout particleDensity={20}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div
            className="text-8xl font-bold gradient-text mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            404
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">页面未找到</h1>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            你访问的页面不存在或已被移除。
          </p>
          <Link href="/">
            <Button className="bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-6 py-5 rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
