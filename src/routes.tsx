import { createBrowserRouter } from 'react-router-dom';
import StudioLayout from '@/components/layout/StudioLayout';
import ProjectSettings from '@/components/ProjectSettings';
import { Project } from '@/integrations/supabase/types/tables';

export const router = createBrowserRouter([
  {
    path: '/project/:id/studio',
    element: (
      <StudioLayout
        files={[]}
        isLoading={false}
        selectedFile={null}
        projectId=""
        onFileSelect={() => {}}
      />
    ),
  },
  {
    path: '/project/:id/settings',
    element: <ProjectSettings project={{
      id: '',
      title: '',
      description: null,
      user_id: '',
      status: 'active',
      project_type: 'web'
    } as Project} />,
  },
]);
