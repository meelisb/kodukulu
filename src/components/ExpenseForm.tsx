import { useState, useEffect, useRef } from "react";
import { format, parse, isValid } from "date-fns";
import { et } from "date-fns/locale";
import { CalendarIcon, Save, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useReceiptParser } from "@/hooks/useReceiptParser";
import { toast } from "@/components/ui/sonner";

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
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const toSentenceCase = (str: string): string => {
  if (!str || str !== str.toUpperCase()) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const parseDateString = (dateStr: string): Date => {
  // Parse "YYYY-MM-DD" without timezone shift
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function ExpenseForm({ initialData, onSubmit, onCancel, isSubmitting }: ExpenseFormProps) {
  const [date, setDate] = useState<Date>(initialData ? parseDateString(initialData.date) : new Date());
  const [dateText, setDateText] = useState(format(initialData ? parseDateString(initialData.date) : new Date(), "dd.MM.yyyy"));
  const [vendor, setVendor] = useState(initialData?.vendor || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [amount, setAmount] = useState(initialData?.amount?.toString().replace(".", ",") || "");
  const [fuelQuantity, setFuelQuantity] = useState(initialData?.fuel_quantity?.toString().replace(".", ",") || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { parseReceipt, isParsing } = useReceiptParser();

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Toetatud on ainult PDF, JPG ja PNG failid");
      return;
    }

    toast.info("Kviitungi analüüsimine...");
    const result = await parseReceipt(file);

    if (result) {
      if (result.date) {
        setDate(new Date(result.date));
      }
      if (result.vendor) {
        setVendor(toSentenceCase(result.vendor));
      }
      if (result.description) {
        setDescription(toSentenceCase(result.description));
      }
      if (result.category && CATEGORIES.includes(result.category as typeof CATEGORIES[number])) {
        setCategory(result.category);
      }
      if (result.amount !== undefined && result.amount !== null) {
        setAmount(result.amount.toString().replace(".", ","));
      }
      if (result.fuel_liters !== undefined && result.fuel_liters !== null) {
        setFuelQuantity(result.fuel_liters.toString().replace(".", ","));
      }
      toast.success("Kviitung analüüsitud! Kontrolli ja täienda andmeid.");
    } else {
      toast.error("Kviitungi analüüsimine ebaõnnestus");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      {/* Receipt upload button */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isParsing || isSubmitting}
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-14 w-full text-lg font-semibold"
          onClick={() => fileInputRef.current?.click()}
          disabled={isParsing || isSubmitting}
        >
          {isParsing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analüüsin...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Laadi kviitung üles
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          PDF, JPG või PNG
        </p>
      </div>

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
        <AutocompleteInput
          value={description}
          onChange={setDescription}
          suggestions={descriptionSuggestions}
          placeholder="Valikuline kirjeldus"
          emptyText="Soovitusi ei leitud"
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
          onClick={onCancel || handleReset}
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
