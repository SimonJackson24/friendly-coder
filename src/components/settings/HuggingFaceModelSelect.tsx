import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const defaultModels = [
  {
    value: "black-forest-labs/FLUX.1-schnell",
    label: "FLUX.1 Schnell",
  },
  {
    value: "stabilityai/stable-diffusion-xl-base-1.0",
    label: "Stable Diffusion XL",
  },
  {
    value: "runwayml/stable-diffusion-v1-5",
    label: "Stable Diffusion v1.5",
  },
];

interface HuggingFaceModelSelectProps {
  currentModel?: string;
}

export function HuggingFaceModelSelect({ currentModel }: HuggingFaceModelSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentModel || defaultModels[0].value);
  const { toast } = useToast();

  const handleSelect = async (currentValue: string) => {
    console.log("Selecting model:", currentValue);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user found");
      toast({
        title: "Error",
        description: "You must be logged in to change settings",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("settings")
      .update({ huggingface_model: currentValue })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating model:", error);
      toast({
        title: "Error",
        description: "Failed to update model settings",
        variant: "destructive",
      });
      return;
    }

    setValue(currentValue);
    setOpen(false);
    toast({
      title: "Success",
      description: "Model settings updated successfully",
    });
  };

  const selectedModel = defaultModels.find((model) => model.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedModel?.label || "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup>
            {defaultModels.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={() => handleSelect(model.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === model.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {model.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}