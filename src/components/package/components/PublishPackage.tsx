import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Package } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Upload, PackagePlus } from "lucide-react";

export function PublishPackage() {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const { toast } = useToast();

  const handlePublish = async () => {
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

    } catch (error) {
      console.error('Error publishing package:', error);
      toast({
        title: "Error",
        description: "Failed to publish package",
        variant: "destructive",
      });
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
          disabled={!name || !version}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Publish Package
        </Button>
      </div>
    </div>
  );
}