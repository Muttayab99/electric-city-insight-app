
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cities, CityData } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CitySelectorProps {
  selectedCity: string;
  onSelectCity: (cityId: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onSelectCity,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedCityData = cities.find((city) => city.id === selectedCity);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[200px] justify-between"
        >
          {selectedCityData ? `${selectedCityData.name}, ${selectedCityData.state}` : "Select city..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {cities.map((city) => (
              <CommandItem
                key={city.id}
                value={city.id}
                onSelect={(currentValue) => {
                  onSelectCity(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCity === city.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.name}, {city.state}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelector;
