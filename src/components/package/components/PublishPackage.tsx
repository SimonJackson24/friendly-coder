import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Package, PackageValidation } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Upload, PackagePlus, AlertTriangle, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PublishPackage() {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [validation, setValidation] = useState<PackageValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const validatePackage = async () => {
    setIsValidating(true);
    try {
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
      }

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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to publish packages",
          variant: "destructive",
        });
        return;
      }

      const { data: packageData, error: packageError } = await supabase
        .from("packages")
        .insert({
          name,
          version,
          description,
          is_private: isPrivate,
          author_id: user.id,
          package_data: {}
        })
        .select()
        .single();

      if (packageError) throw packageError;

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

    } catch (error) {
      console.error('Error publishing package:', error);
      toast({
        title: "Error",
        description: "Failed to publish package",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2">
        <PackagePlus className="w-5 h-5" />
        Publish New Package
      </h3>
      
      <div className="space-y-3">
        <Input
          placeholder="Package name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Input
          placeholder="Version (e.g. 1.0.0)"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
        
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {validation && (
          <div className="space-y-2">
            {validation.errors.map((error, i) => (
              <Alert key={i} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
            
            {validation.warnings.map((warning, i) => (
              <Alert key={i} variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>{warning}</AlertDescription>
              </Alert>
            ))}

            {validation.dependencies.map((dep, i) => (
              <Alert key={i} variant={dep.isCompatible ? "default" : "destructive"}>
                {dep.isCompatible ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                <AlertTitle>{dep.name}@{dep.version}</AlertTitle>
                {!dep.isCompatible && (
                  <AlertDescription>
                    {dep.conflicts.join(", ")}
                  </AlertDescription>
                )}
              </Alert>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="private">Private package</label>
        </div>
        
        <Button 
          onClick={handlePublish}
          disabled={!name || !version || isValidating || isPublishing}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isValidating ? "Validating..." : isPublishing ? "Publishing..." : "Publish Package"}
        </Button>
      </div>
    </div>
  );
}