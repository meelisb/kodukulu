import { useState } from "react";
import { ExpenseForm, type ExpenseFormData } from "@/components/ExpenseForm";
import { useAddExpense } from "@/hooks/useExpenses";
import { toast } from "@/components/ui/sonner";

export default function AddExpense() {
  const addExpense = useAddExpense();
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = (data: ExpenseFormData) => {
    addExpense.mutate(data, {
      onSuccess: () => {
        toast.success("Kulu salvestatud!");
        setFormKey((prev) => prev + 1);
      },
      onError: () => {
        toast.error("Viga salvestamisel");
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Lisa kulu</h1>
      <ExpenseForm 
        key={formKey}
        onSubmit={handleSubmit} 
        isSubmitting={addExpense.isPending} 
      />
    </div>
  );
}
