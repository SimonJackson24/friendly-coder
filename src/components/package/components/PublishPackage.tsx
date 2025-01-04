import { useState } from "react";
import { PackagePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PublishValidation, PublishStep } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { PublishSteps } from "./publish/PublishSteps";
import { ValidationSection } from "./publish/ValidationSection";
import { PublishForm } from "./publish/PublishForm";

export function PublishPackage() {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [validation, setValidation] = useState<PublishValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSteps, setPublishSteps] = useState<PublishStep[]>([]);
  const { toast } = useToast();

  const updateStep = (id: string, status: PublishStep['status'], error?: string) => {
    setPublishSteps(steps => 
      steps.map(step => 
        step.id === id 
          ? { ...step, status, error }
          : step
      )
    );
  };

  const validatePackage = async () => {
    setIsValidating(true);
    try {
      console.log('Validating package:', { name, version, description });
      
      const { data: validationData, error } = await supabase.functions.invoke('package-operations', {
        body: { 
          operation: 'validate-package',
          data: { name, version, description }
        }
      });

      if (error) throw error;
      
      setValidation(validationData);
      
      if (!validationData.isValid) {
        toast({
          title: "Validation Failed",
          description: "Please fix the errors before publishing",
          variant: "destructive",
        });
        return false;
      }

      setPublishSteps([
        {
          id: 'dependencies',
          title: 'Dependency Resolution',
          description: 'Checking and resolving package dependencies...',
          status: 'pending'
        },
        {
          id: 'conflicts',
          title: 'Version Conflict Check',
          description: 'Analyzing potential version conflicts...',
          status: 'pending'
        },
        {
          id: 'publish',
          title: 'Package Publication',
          description: 'Publishing package to registry...',
          status: 'pending'
        }
      ]);

      return validationData.isValid;
    } catch (error) {
      console.error('Error validating package:', error);
      toast({
        title: "Error",
        description: "Failed to validate package",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handlePublish = async () => {
    const isValid = await validatePackage();
    if (!isValid) return;

    setIsPublishing(true);
    try {
      // Step 1: Dependency Resolution
      updateStep('dependencies', 'in_progress');
      const { data: depData, error: depError } = await supabase.functions.invoke('package-operations', {
        body: { 
          operation: 'resolve-dependencies',
          data: { name, version }
        }
      });
      
      if (depError) throw { step: 'dependencies', error: depError };
      updateStep('dependencies', 'completed');

      // Step 2: Conflict Check
      updateStep('conflicts', 'in_progress');
      const { data: conflictData, error: conflictError } = await supabase.functions.invoke('package-operations', {
        body: { 
          operation: 'check-conflicts',
          data: { name, version, dependencies: depData.dependencies }
        }
      });
      
      if (conflictError) throw { step: 'conflicts', error: conflictError };
      updateStep('conflicts', 'completed');

      // Step 3: Publish
      updateStep('publish', 'in_progress');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw { step: 'publish', error: "You must be logged in to publish packages" };
      }

      const { error: publishError } = await supabase
        .from("packages")
        .insert({
          name,
          version,
          description,
          is_private: isPrivate,
          author_id: user.id,
          package_data: {
            dependencies: depData.dependencies,
            conflicts: conflictData.conflicts
          }
        });

      if (publishError) throw { step: 'publish', error: publishError };
      
      updateStep('publish', 'completed');

      toast({
        title: "Success",
        description: `Package ${name}@${version} published successfully`,
      });

      // Reset form
      setName("");
      setVersion("");
      setDescription("");
      setIsPrivate(true);
      setValidation(null);
      setPublishSteps([]);

    } catch (error: any) {
      console.error('Error publishing package:', error);
      if (error.step) {
        updateStep(error.step, 'error', error.error.message || "An error occurred");
      }
      toast({
        title: "Error",
        description: "Failed to publish package",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    setPublishSteps([]);
    setIsPublishing(false);
  };

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
          
          <ValidationSection validation={validation} />
        </>
      ) : (
        <PublishSteps
          steps={publishSteps}
          onComplete={() => setPublishSteps([])}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}