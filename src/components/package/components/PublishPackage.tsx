import { PackagePlus } from "lucide-react";
import { PublishForm } from "./publish/PublishForm";
import { PublishSteps } from "./publish/PublishSteps";
import { ValidationFeedback } from "./publish/ValidationFeedback";
import { usePublishPackage } from "../hooks/usePublishPackage";

export function PublishPackage() {
  const {
    name,
    version,
    description,
    isPrivate,
    validation,
    isValidating,
    isPublishing,
    publishSteps,
    setName,
    setVersion,
    setDescription,
    setIsPrivate,
    handlePublish,
    handleCancel,
  } = usePublishPackage();

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">
        <PackagePlus className="w-5 h-5" />
        Publish New Package
      </h3>
      
      {!publishSteps.length ? (
        <>
          <PublishForm
            name={name}
            version={version}
            description={description}
            isPrivate={isPrivate}
            isValidating={isValidating}
            isPublishing={isPublishing}
            onNameChange={setName}
            onVersionChange={setVersion}
            onDescriptionChange={setDescription}
            onPrivateChange={setIsPrivate}
            onPublish={handlePublish}
          />
          
          <ValidationFeedback validation={validation} />
        </>
      ) : (
        <PublishSteps
          steps={publishSteps}
          onComplete={() => handleCancel()}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}