import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, PublishValidation } from '../types';
import { validatePackage } from '../validation/packageValidation';
import { ConflictResolutionStrategy } from '../conflict-resolution/types';
import { toast } from '@/components/ui/use-toast';

export function usePublishPackage() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [validation, setValidation] = useState<PublishValidation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const validateAndPublish = async (pkg: Package) => {
    console.log('Starting package validation and publish process');
    setIsPublishing(true);
    
    try {
      const validationResult = await validatePackage(pkg);
      console.log('Validation result:', validationResult);

      setValidation({
        ...validationResult,
        publishSteps: [],
        breakingChanges: [],
        dependencyChecks: []
      });

      if (!validationResult.isValid) {
        console.log('Package validation failed');
        toast({
          title: "Validation Failed",
          description: "Please resolve all validation errors before publishing",
          variant: "destructive"
        });
        return;
      }

      setCurrentStep(1);
      const { data: existingPackage, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .eq('name', pkg.name)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

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
      const { error: versionError } = await supabase
        .from('package_versions')
        .insert({
          package_id: pkg.id,
          version: pkg.version,
          package_data: pkg.package_data,
          published_by: pkg.author_id,
          created_at: new Date().toISOString()
        });

      if (versionError) throw versionError;

      setCurrentStep(4);
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
            resolved_version: strategy.action === 'upgrade' ? strategy.id.split('-')[1] : null,
            resolution_date: new Date().toISOString(),
            risk_level: strategy.risk
          });

        if (error) throw error;
      }

      // Refresh validation after applying resolutions
      if (validation?.package_id) {
        const updatedValidation = await validatePackage({
          id: validation.package_id,
          name: '',
          version: '',
          description: '',
          is_private: false,
          author_id: '',
          package_data: {}
        });
        setValidation(updatedValidation);
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
  };

  return {
    isPublishing,
    validation,
    currentStep,
    validateAndPublish,
    handleConflictResolutions,
    handleCancel,
  };
}