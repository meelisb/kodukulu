import { useState, useEffect } from "react";
import { format } from "date-fns";
import { et } from "date-fns/locale";
import { CalendarIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Expense } from "@/types/expense";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { useVendorSuggestions, useDescriptionSuggestions } from "@/hooks/useAutocompleteSuggestions";

export interface ExpenseFormData {
  date: string;
  vendor: string;
  description?: string;
  category: string;
  amount: number;
  fuel_quantity?: number | null;
}

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
  isSubmitting?: boolean;
}

export function ExpenseForm({ initialData, onSubmit, isSubmitting }: ExpenseFormProps) {
  const [date, setDate] = useState<Date>(initialData ? new Date(initialData.date) : new Date());
  const [vendor, setVendor] = useState(initialData?.vendor || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [amount, setAmount] = useState(initialData?.amount?.toString().replace(".", ",") || "");
  const [fuelQuantity, setFuelQuantity] = useState(initialData?.fuel_quantity?.toString().replace(".", ",") || "");

  const { data: vendorSuggestions = [] } = useVendorSuggestions();
  const { data: descriptionSuggestions = [] } = useDescriptionSuggestions();

  useEffect(() => {
    if (initialData) {
      setDate(new Date(initialData.date));
      setVendor(initialData.vendor);
      setDescription(initialData.description || "");
      setCategory(initialData.category);
      setAmount(initialData.amount.toString().replace(".", ","));
      setFuelQuantity(initialData.fuel_quantity?.toString().replace(".", ",") || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !category || !amount) return;

    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      vendor,
      description: description || undefined,
      category,
      amount: parseFloat(amount.replace(",", ".")),
      fuel_quantity:
        category === "Auto" && fuelQuantity
          ? parseFloat(fuelQuantity.replace(",", "."))
          : null,
    });
  };

  const handleReset = () => {
    setDate(initialData ? new Date(initialData.date) : new Date());
    setVendor(initialData?.vendor || "");
    setDescription(initialData?.description || "");
    setCategory(initialData?.category || "");
    setAmount(initialData?.amount?.toString().replace(".", ",") || "");
    setFuelQuantity(initialData?.fuel_quantity?.toString().replace(".", ",") || "");
  };

  const isFormValid = vendor && category && amount;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Kuupäev</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-12 w-full justify-start text-left text-base font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {date ? format(date, "dd.MM.yyyy", { locale: et }) : <span>Vali kuupäev</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Saaja *</Label>
        <AutocompleteInput
          value={vendor}
          onChange={setVendor}
          suggestions={vendorSuggestions}
          placeholder="nt. Bauhaus, Selver..."
          emptyText="Soovitusi ei leitud"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Kirjeldus</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Valikuline kirjeldus"
          className="min-h-[80px] text-base"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Kategooria *</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Vali kategooria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-base">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Summa (€) *</Label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          inputMode="decimal"
          className="h-12 text-base"
        />
      </div>

      {category === "Auto" && (
        <div className="space-y-2">
          <Label className="text-base font-semibold">Kütuse kogus (l)</Label>
          <Input
            value={fuelQuantity}
            onChange={(e) => setFuelQuantity(e.target.value)}
            placeholder="nt. 45,5"
            inputMode="decimal"
            className="h-12 text-base"
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-14 flex-1 text-lg font-semibold"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Tühista
        </Button>
        <Button
          type="submit"
          size="lg"
          className="h-14 flex-1 text-lg font-semibold"
          disabled={isSubmitting || !isFormValid}
        >
          <Save className="mr-2 h-5 w-5" />
          {isSubmitting ? "Salvestamine..." : "Salvesta"}
        </Button>
      </div>
    </form>
  );
}
