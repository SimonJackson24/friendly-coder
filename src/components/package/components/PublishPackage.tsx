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

  const steps = publishSteps.map(step => ({
    ...step,
    name: step.title.toLowerCase().replace(/\s+/g, '-')
  }));

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">
        <PackagePlus className="w-5 h-5" />
        Publish New Package
      </h3>
      
      {!steps.length ? (
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
          steps={steps}
          onComplete={() => handleCancel()}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}