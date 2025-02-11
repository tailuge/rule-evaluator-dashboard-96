
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JSONViewerProps {
  data: any;
  level?: number;
}

const JSONViewer = ({ data, level = 0 }: JSONViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (typeof data !== 'object' || data === null) {
    return (
      <span className={cn(
        "text-sm",
        typeof data === 'string' && "text-green-600",
        typeof data === 'number' && "text-blue-600",
        typeof data === 'boolean' && "text-purple-600",
        data === null && "text-gray-500"
      )}>
        {JSON.stringify(data)}
      </span>
    );
  }

  const isArray = Array.isArray(data);
  const items = Object.entries(data);

  return (
    <div style={{ paddingLeft: level > 0 ? '1.5rem' : '0' }}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 hover:text-blue-600">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isArray ? '[' : '{'}
          </span>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {items.map(([key, value], index) => (
            <div key={key} className="py-1">
              <div className="flex items-start">
                <span className="text-sm text-gray-700 mr-2">
                  {!isArray && `"${key}":`}
                </span>
                <JSONViewer data={value} level={level + 1} />
              </div>
            </div>
          ))}
        </CollapsibleContent>
        
        <span className="text-sm font-medium">
          {isArray ? ']' : '}'}
        </span>
      </Collapsible>
    </div>
  );
};

export default JSONViewer;
