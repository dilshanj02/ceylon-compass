const BudgetInput = ({
  budget,
  setBudget,
  validationErrors,
  setValidationErrors,
  serializerErrors,
}) => {
  return (
    <fieldset className="relative">
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Budget
      </legend>
      <div className="relative">
        {/* Budget input */}
        <input
          className="input input-bordered w-full rounded-full focus:outline-none"
          placeholder="Enter budget (LKR)"
          value={budget ? Number(budget).toLocaleString() : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            setBudget(value);
            setValidationErrors((prev) => ({ ...prev, budget: "" }));
          }}
        />
        {validationErrors.budget && (
          <p className="text-red-500 text-xs mt-1 pl-4">
            {validationErrors.budget}
          </p>
        )}
        {serializerErrors.budget && (
          <p className="text-red-500 mt-1 pl-4">{serializerErrors.budget}</p>
        )}
      </div>
    </fieldset>
  );
};

export default BudgetInput;
