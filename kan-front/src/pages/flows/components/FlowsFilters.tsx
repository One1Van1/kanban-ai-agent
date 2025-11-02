import { useState } from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';

interface FlowsFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
}

export function FlowsFilters({
  onSearchChange,
  onStatusChange,
}: FlowsFiltersProps) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search flows..."
          value={localSearch}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusChange('')}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('draft')}>
            Draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('active')}>
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('archived')}>
            Archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
