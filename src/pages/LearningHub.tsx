import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TutorialList } from '@/components/learning/TutorialList';
import { LearningPathList } from '@/components/learning/paths/LearningPathList';

export default function LearningHub() {
  const location = useLocation();
  const showTabs = location.pathname === '/learning';

  return (
    <div className="container py-8 space-y-8">
      {showTabs ? (
        <Tabs defaultValue="tutorials">
          <TabsList>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          </TabsList>
          <TabsContent value="tutorials">
            <TutorialList />
          </TabsContent>
          <TabsContent value="paths">
            <LearningPathList />
          </TabsContent>
        </Tabs>
      ) : (
        <Outlet />
      )}
    </div>
  );
}