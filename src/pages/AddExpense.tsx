import { useState } from "react";
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
import { useAddExpense } from "@/hooks/useExpenses";
import { CATEGORIES } from "@/types/expense";
import { toast } from "@/components/ui/sonner";

export default function AddExpense() {
  const [date, setDate] = useState<Date>(new Date());
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [fuelQuantity, setFuelQuantity] = useState("");

  const addExpense = useAddExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendor || !category || !amount) {
      toast.error("Palun täida kõik kohustuslikud väljad");
      return;
    }

    addExpense.mutate(
      {
        date: format(date, "yyyy-MM-dd"),
        vendor,
        description: description || undefined,
        category,
        amount: parseFloat(amount.replace(",", ".")),
        fuel_quantity:
          category === "Auto" && fuelQuantity
            ? parseFloat(fuelQuantity.replace(",", "."))
            : null,
      },
      {
        onSuccess: () => {
          toast.success("Kulu salvestatud!");
          setVendor("");
          setDescription("");
          setCategory("");
          setAmount("");
          setFuelQuantity("");
          setDate(new Date());
        },
        onError: () => {
          toast.error("Viga salvestamisel");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Lisa kulu</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Kuupäev</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 w-full justify-start text-left text-base font-normal"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {format(date, "dd.MM.yyyy", { locale: et })}
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

        {/* Vendor */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Saaja *</Label>
          <Input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="nt. Bauhaus, Selver..."
            className="h-12 text-base"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Kirjeldus</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Valikuline kirjeldus"
            className="min-h-[80px] text-base"
          />
        </div>

        {/* Category */}
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

        {/* Amount */}
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

        {/* Fuel quantity — only for Auto */}
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

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="h-14 w-full text-lg font-semibold"
          disabled={addExpense.isPending}
        >
          <Save className="mr-2 h-5 w-5" />
          {addExpense.isPending ? "Salvestamine..." : "Salvesta"}
        </Button>
      </form>
    </div>
  );
}
