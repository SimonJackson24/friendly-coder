import { AndroidStudio } from "../android/AndroidStudio";

interface AndroidBuildSectionProps {
  projectId: string;
}

export function AndroidBuildSection({ projectId }: AndroidBuildSectionProps) {
  return <AndroidStudio />;
}