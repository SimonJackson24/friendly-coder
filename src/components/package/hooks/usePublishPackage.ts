import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, PublishValidation } from '../types';
import { validatePackage } from '../validation/packageValidation';
import { ConflictResolutionStrategy } from '../conflict-resolution/types';
import { toast } from '@/components/ui/use-toast';

export function usePublishPackage() {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<PublishValidation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [publishSteps, setPublishSteps] = useState<Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    error?: string;
  }>>([]);

  const handlePublish = async () => {
    setIsValidating(true);
    const pkg: Package = {
      id: '', // Will be generated on insert
      name,
      version,
      description,
      is_private: isPrivate,
      author_id: '', // Will be set by RLS
      package_data: {},
      download_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const validationResult = await validatePackage(
        name,
        version,
        description,
        {} // Empty dependencies object for now
      );
      
      setValidation({
        valid: validationResult.valid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        dependencyChecks: [],
        breakingChanges: [],
        dependencies: [],
        publishSteps: []
      });

      if (!validationResult.valid) {
        toast({
          title: "Validation Failed",
          description: "Please resolve all validation errors before publishing",
          variant: "destructive"
        });
        return;
      }

      setCurrentStep(1);
      await validateAndPublish(pkg);

    } catch (error) {
      console.error('Error during publish:', error);
      toast({
        title: "Error",
        description: "An error occurred during validation",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateAndPublish = async (pkg: Package) => {
    console.log('Starting package validation and publish process');
    setIsPublishing(true);
    
    try {
      const { data: existingPackage, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .eq('name', pkg.name)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setCurrentStep(2);
      if (existingPackage) {
        const { error: updateError } = await supabase
          .from('packages')
          .update({
            version: pkg.version,
            description: pkg.description,
            package_data: pkg.package_data,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPackage.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('packages')
          .insert({
            ...pkg,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      setCurrentStep(3);
      toast({
        title: "Success",
        description: "Package published successfully",
      });

    } catch (error) {
      console.error('Error during publish:', error);
      toast({
        title: "Error",
        description: "An error occurred during the publish process",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConflictResolutions = async (
    resolutions: Record<string, ConflictResolutionStrategy>
  ) => {
    console.log('Applying conflict resolutions:', resolutions);
    
    try {
      setCurrentStep(currentStep + 1);
      
      for (const [packageName, strategy] of Object.entries(resolutions)) {
        const { error } = await supabase
          .from('dependency_resolutions')
          .insert({
            package_name: packageName,
            resolution_strategy: strategy.action,
            resolved_version: strategy.suggestedVersion,
            risk_level: strategy.risk
          });

        if (error) throw error;
      }

      toast({
        title: "Conflicts Resolved",
        description: "All dependency conflicts have been resolved",
      });

    } catch (error) {
      console.error('Error applying resolutions:', error);
      toast({
        title: "Error",
        description: "Failed to apply conflict resolutions",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    console.log('Cancelling publish process');
    setIsPublishing(false);
    setValidation(null);
    setCurrentStep(0);
    setName('');
    setVersion('');
    setDescription('');
    setIsPrivate(false);
    setPublishSteps([]);
  };

  return {
    name,
    version,
    description,
    isPrivate,
    isPublishing,
    isValidating,
    validation,
    currentStep,
    publishSteps,
    setName,
    setVersion,
    setDescription,
    setIsPrivate,
    handlePublish,
    handleConflictResolutions,
    handleCancel,
  };
}