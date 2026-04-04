import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseForm, type ExpenseFormData } from "@/components/ExpenseForm";
import { useAddExpense } from "@/hooks/useExpenses";
import { toast } from "@/components/ui/sonner";

export default function AddExpense() {
  const addExpense = useAddExpense();
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = (data: ExpenseFormData) => {
    addExpense.mutate(data, {
      onSuccess: (created) => {
        toast.success("Kulu salvestatud!");
        setFormKey((prev) => prev + 1);
        navigate(`/history?highlight=${created.id}`);
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
