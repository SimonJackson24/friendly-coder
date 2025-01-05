import { createBrowserRouter } from 'react-router-dom';
import { StudioLayout } from '@/modules/ai-studio/components/layout/StudioLayout';
import { ProjectSettings } from '@/components/ProjectSettings';
import { ProjectsTable } from '@/integrations/supabase/types/tables';

export const router = createBrowserRouter([
  {
    path: '/project/:id/studio',
    element: (
      <StudioLayout
        files={[]}
        isLoading={false}
        selectedFile={null}
        projectId=""
        consoleOutput={[]}
        buildErrors={[]}
        project={null}
        onFileSelect={() => {}}
        onCreateFile={() => {}}
        onDeleteFile={() => {}}
        onSaveFile={() => {}}
        onClearConsole={() => {}}
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
    } as ProjectsTable['Row']} />,
  },
]);